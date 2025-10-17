-- ============================================
-- Script de creación de base de datos: Turnera
-- Sistema de Gestión de Turnos Médicos
-- ============================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS turnera
CHARACTER SET utf8mb4
COLLATE utf8mb4_0900_ai_ci;

-- Usar la base de datos
USE turnera;

-- ============================================
-- TABLA: doctor
-- ============================================
CREATE TABLE IF NOT EXISTS doctor (
    id_doctor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    matricula VARCHAR(20) UNIQUE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: especialidad
-- ============================================
CREATE TABLE IF NOT EXISTS especialidad (
    id_especialidad INT AUTO_INCREMENT PRIMARY KEY,
    nombre_especialidad VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: cobertura
-- ============================================
CREATE TABLE IF NOT EXISTS cobertura (
    id_cobertura INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: obra_social
-- ============================================
CREATE TABLE IF NOT EXISTS obra_social (
    codigo VARCHAR(6) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    id_cobertura INT NOT NULL,
    activa BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_cobertura) REFERENCES cobertura(id_cobertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: paciente
-- ============================================
CREATE TABLE IF NOT EXISTS paciente (
    dni_paciente VARCHAR(9) PRIMARY KEY,
    nombre VARCHAR(50),
    apellido VARCHAR(50),
    fecha_nacimiento DATE NOT NULL,
    direccion TEXT,
    telefono VARCHAR(15) NOT NULL,
    email VARCHAR(100) DEFAULT NULL,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP,
    activo BOOLEAN DEFAULT TRUE,
    id_obra_social VARCHAR(6) NOT NULL,
    numero_afiliado VARCHAR(50) NULL,
    id_cobertura INT NOT NULL DEFAULT 1,
    FOREIGN KEY (id_obra_social) REFERENCES obra_social(codigo),
    FOREIGN KEY (id_cobertura) REFERENCES cobertura(id_cobertura)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: consultorio
-- ============================================
CREATE TABLE IF NOT EXISTS consultorio (
    id_consultorio INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: horario_disponible
-- ============================================
CREATE TABLE IF NOT EXISTS horario_disponible (
    id_horario INT AUTO_INCREMENT PRIMARY KEY,
    id_doctor INT NOT NULL,
    id_consultorio INT NOT NULL,
    dia_semana ENUM('lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo') NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    duracion_turno INT DEFAULT 30,
    FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor) ON DELETE CASCADE,
    FOREIGN KEY (id_consultorio) REFERENCES consultorio(id_consultorio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: turno
-- ============================================
CREATE TABLE IF NOT EXISTS turno (
    id_turno INT AUTO_INCREMENT PRIMARY KEY,
    id_paciente VARCHAR(9) NOT NULL,
    id_doctor INT NOT NULL,
    id_consultorio INT NOT NULL,
    fecha_hora DATETIME NOT NULL,
    fecha_solicitud DATETIME DEFAULT CURRENT_TIMESTAMP,
    duracion_minutos INT NOT NULL DEFAULT 30,
    estado ENUM('pendiente', 'confirmado', 'completado', 'cancelado'),
    FOREIGN KEY (id_paciente) REFERENCES paciente(dni_paciente),
    FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor),
    FOREIGN KEY (id_consultorio) REFERENCES consultorio(id_consultorio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- TABLA: doctor_especialidad (relación N:N)
-- ============================================
CREATE TABLE IF NOT EXISTS doctor_especialidad (
    id_doctor INT NOT NULL,
    id_especialidad INT NOT NULL,
    PRIMARY KEY (id_doctor, id_especialidad),
    FOREIGN KEY (id_doctor) REFERENCES doctor(id_doctor),
    FOREIGN KEY (id_especialidad) REFERENCES especialidad(id_especialidad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- ============================================
-- ÍNDICES ADICIONALES (para mejorar performance)
-- ============================================

-- Índice para búsquedas de turnos por fecha
CREATE INDEX idx_turno_fecha_hora ON turno(fecha_hora);

-- Índice para búsquedas de turnos por estado
CREATE INDEX idx_turno_estado ON turno(estado);

-- Índice para búsquedas de turnos por doctor
CREATE INDEX idx_turno_doctor ON turno(id_doctor);

-- Índice para búsquedas de turnos por paciente
CREATE INDEX idx_turno_paciente ON turno(id_paciente);

-- Índice para búsquedas de horarios por día
CREATE INDEX idx_horario_dia ON horario_disponible(dia_semana);

-- Índice para búsquedas de pacientes activos
CREATE INDEX idx_paciente_activo ON paciente(activo);

-- Índice para búsquedas de doctores activos
CREATE INDEX idx_doctor_activo ON doctor(activo);

-- ============================================
-- MENSAJE DE ÉXITO
-- ============================================
SELECT 'Base de datos "turnera" creada exitosamente' AS mensaje;
