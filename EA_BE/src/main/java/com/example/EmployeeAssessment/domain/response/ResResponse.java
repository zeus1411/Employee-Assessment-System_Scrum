package com.example.EmployeeAssessment.domain.response;

import lombok.Data;

@Data
public class ResResponse<T> {
    private int statusCode;
    private String error;

    // message có thể là string, hoặc arrayList
    private Object message;
    private T data;

}
