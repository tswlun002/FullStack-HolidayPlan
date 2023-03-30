package com.Tour.exception;

import org.hibernate.engine.jdbc.spi.SqlExceptionHelper;
import org.hibernate.exception.spi.SQLExceptionConverter;

public class SQLException extends SqlExceptionHelper {
    public SQLException(SQLExceptionConverter sqlExceptionConverter, boolean logWarnings) {
        super(sqlExceptionConverter, logWarnings);
    }
}
