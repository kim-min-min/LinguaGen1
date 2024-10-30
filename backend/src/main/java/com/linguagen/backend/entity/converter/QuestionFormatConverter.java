package com.linguagen.backend.entity.converter;

import com.linguagen.backend.entity.Question.QuestionFormat;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class QuestionFormatConverter implements AttributeConverter<QuestionFormat, String> {

    @Override
    public String convertToDatabaseColumn(QuestionFormat attribute) {
        if (attribute == null) {
            return null;
        }
        return attribute.getValue();
    }

    @Override
    public QuestionFormat convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }

        for (QuestionFormat format : QuestionFormat.values()) {
            if (format.getValue().equals(dbData)) {
                return format;
            }
        }

        throw new IllegalArgumentException("Unknown database value: " + dbData);
    }
}