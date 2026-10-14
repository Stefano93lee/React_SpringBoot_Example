package com.example.todo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ScheduleRequest(
        @NotBlank(message = "일정 내용을 입력해주세요.")
        @Size(max = 255, message = "일정은 255자 이하로 입력해주세요.")
        String content
) {
}
