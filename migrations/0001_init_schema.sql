-- Drop tables if exists
DROP TABLE IF EXISTS audit_logs;
DROP TABLE IF EXISTS riu_configurations;
DROP TABLE IF EXISTS tender_items;
DROP TABLE IF EXISTS system_configs;
DROP TABLE IF EXISTS users;

-- 1. Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    display_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('GUEST', 'AUDITOR', 'AVIONICS_ADMIN')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. System Configurations & Feature Flags
CREATE TABLE system_configs (
    config_key TEXT PRIMARY KEY,
    config_value TEXT NOT NULL,
    description TEXT,
    is_feature_flag INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tender Meta Information
CREATE TABLE tender_items (
    id TEXT PRIMARY KEY,
    project_no TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    buyer_name TEXT NOT NULL,
    agency_name TEXT NOT NULL,
    publish_time DATETIME NOT NULL,
    deadline DATETIME NOT NULL,
    doc_fee REAL DEFAULT 500.00,
    status TEXT NOT NULL CHECK(status IN ('OPEN', 'IN_REVIEW', 'CLOSED')),
    summary TEXT,
    raw_content TEXT
);

-- 4. RIU Configuration & Binary Mapping Simulator
CREATE TABLE riu_configurations (
    id TEXT PRIMARY KEY,
    config_name TEXT NOT NULL,
    version TEXT NOT NULL,
    target_bus_type TEXT NOT NULL CHECK(target_bus_type IN ('ARINC429', 'MIL_STD_1553B', 'AFDX', 'HYBRID')),
    flash_address_hex TEXT NOT NULL,
    binary_size_bytes INTEGER DEFAULT 0,
    crc32_checksum TEXT,
    generated_c_code TEXT,
    generated_h_code TEXT,
    created_by TEXT REFERENCES users(id),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. System Audit Logs
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    action TEXT NOT NULL,
    ip_address TEXT,
    payload TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Seed Initial Data
INSERT INTO users (id, email, password_hash, display_name, role) VALUES
('usr_admin_01', 'admin@softwarelink.net', '$2a$12$eX4mP1eH4sh3dAdm1nP4ssw0rdK3yVal', '系统首席架构师 (Admin)', 'AVIONICS_ADMIN'),
('usr_audit_01', 'auditor@softwarelink.net', '$2a$12$eX4mP1eH4sh3dAud1t0rP4ssw0rdK3y', '合规审计专员', 'AUDITOR');

INSERT INTO system_configs (config_key, config_value, description, is_feature_flag) VALUES
('ENABLE_HEX_FLASH_STREAMING', 'true', '启用RIU二进制Flash流实时编译模拟', 1),
('ENABLE_MISRA_COMPLIANCE_CHECK', 'true', '启用C代码生成MISRA-C航空级规范审查', 1),
('PROJECT_SLUG', '26-riu-cfg-bid', '项目唯一Slug标识', 0),
('DEPLOYMENT_HOST', 'https://26-riu-cfg-bid.softwarelink.net/', '主控域名', 0);

INSERT INTO tender_items (id, project_no, title, buyer_name, agency_name, publish_time, deadline, doc_fee, status, summary) VALUES
('tnd_0730_2026_01', '0730-2611010442/01', '开放式架构的远程接口单元接口配置工具', '中国航空工业集团公司西安航空计算技术研究所', '中航招采科技（北京）有限公司', '2026-08-03 10:37:16', '2026-08-27 09:30:00', 500.00, 'OPEN', 'PC端配置工具，根据接口控制文件和数据配置文件生成二进制配置文件及独立C/H解析函数。');
