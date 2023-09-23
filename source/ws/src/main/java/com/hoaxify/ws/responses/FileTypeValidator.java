package com.hoaxify.ws.responses;

import com.hoaxify.ws.service.implementation.FileServiceImpl;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.hibernate.validator.constraintvalidation.HibernateConstraintValidatorContext;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.stream.Collectors;

public class FileTypeValidator implements ConstraintValidator<FileType, String> {

    @Autowired
    FileServiceImpl fileService;

    String[] types;

    @Override
    public void initialize(FileType constraintAnnotation) {
        this.types = constraintAnnotation.types();
    }

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null || value.isEmpty()) {
            return true;
        }
        String fileType = fileService.detectType(value);

        for (String supportedType : this.types) {
            if (fileType.contains(supportedType)) {
                return true;
            }
        }

        String supportedTypes = Arrays.stream(this.types).collect(Collectors.joining(", "));

        constraintValidatorContext.disableDefaultConstraintViolation();
        HibernateConstraintValidatorContext unwrap = constraintValidatorContext.unwrap(HibernateConstraintValidatorContext.class);
        unwrap.addMessageParameter("types", supportedTypes);
        unwrap.buildConstraintViolationWithTemplate(constraintValidatorContext.getDefaultConstraintMessageTemplate()).addConstraintViolation();

        return false;
    }
}
