package com.Tour.repository;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import static org.junit.jupiter.api.Assertions.*;
@DataJpaTest
class HolidayPlanRepositoryTest {


    @Autowired private HolidayPlanRepository repository;
    @Autowired private HolidayImagesRepository imagesRepository;
    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void getHolidayPlan() {
    }

    @Test
    void testGetHolidayPlan() {
    }

    @Test
    void testGetHolidayPlan1() {
    }

    @Test
    void testGetHolidayPlan2() {
    }

    @Test
    void testGetHolidayPlan3() {
    }
}