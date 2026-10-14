package com.example.todo.dto;

import com.example.todo.entity.Schedule;

import java.time.Instant;

public record ScheduleResponse(Long id, String content, Instant createdAt) {

    public static ScheduleResponse from(Schedule schedule) {
        return new ScheduleResponse(schedule.getId(), schedule.getContent(), schedule.getCreatedAt());
    }
}
