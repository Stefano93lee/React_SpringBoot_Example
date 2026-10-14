package com.example.todo.service;

import com.example.todo.dto.ScheduleRequest;
import com.example.todo.dto.ScheduleResponse;
import com.example.todo.entity.Schedule;
import com.example.todo.repository.ScheduleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ScheduleService {

    private final ScheduleRepository scheduleRepository;

    public ScheduleService(ScheduleRepository scheduleRepository) {
        this.scheduleRepository = scheduleRepository;
    }

    public List<ScheduleResponse> findAll() {
        return scheduleRepository.findAllByOrderByCreatedAtDescIdDesc().stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Transactional
    public ScheduleResponse create(ScheduleRequest request) {
        Schedule saved = scheduleRepository.save(new Schedule(request.content().trim()));
        return ScheduleResponse.from(saved);
    }
}
