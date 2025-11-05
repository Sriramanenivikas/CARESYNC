# Spring Boot Multi-Module Project - Complete Documentation

---

## 📚 IMPORTANT DOCUMENTATION FILES

- **[CLAUDE.md](CLAUDE.md)** - Main project documentation (this file)
- **[ERRORS_AND_DEBUGGING.md](ERRORS_AND_DEBUGGING.md)** - Complete error catalog, debugging commands, and troubleshooting guide

**When debugging issues, ALWAYS consult ERRORS_AND_DEBUGGING.md first!**

---

# ⚠️ CRITICAL SAFETY RULES - READ THIS FIRST ⚠️

## 🚨 DATABASE OPERATIONS - EXTREME CAUTION REQUIRED 🚨

### ❌ NEVER RUN THESE COMMANDS WITHOUT EXPLICIT WARNING:

**DESTRUCTIVE SQL COMMANDS:**
- ❌ `DROP TABLE` - Deletes entire table
- ❌ `DROP DATABASE` - Deletes entire database
- ❌ `TRUNCATE TABLE ... CASCADE` - **DELETES DATA FROM MULTIPLE TABLES**
- ❌ `DELETE FROM table_name` (without WHERE) - Deletes all rows
- ❌ `UPDATE table_name SET ...` (without WHERE) - Updates all rows
- ❌ `ALTER TABLE ... DROP COLUMN` - Permanently removes column

**DESTRUCTIVE FILE OPERATIONS:**
- ❌ `rm -rf` - Recursively deletes files/directories
- ❌ `git reset --hard` - Discards all uncommitted changes
- ❌ `git push --force` - Overwrites remote history
- ❌ `mvn clean` - Deletes build artifacts

### ✅ MANDATORY WARNING FORMAT:

Before ANY destructive command, Claude MUST display:

```
🚨🚨🚨 DANGER - DESTRUCTIVE OPERATION 🚨🚨🚨

COMMAND: [the dangerous command]

THIS WILL:
- [Specific consequence 1]
- [Specific consequence 2]
- [What data will be lost]

⚠️ THIS CANNOT BE UNDONE ⚠️

SAFE ALTERNATIVE: [Show safer option if available]

Do you want to proceed? (Type YES to confirm)
```

### 📋 SAFE DATABASE PRACTICES:

**To reset auto-increment WITHOUT deleting data:**
```sql
-- Safe way - only resets sequence
ALTER SEQUENCE table_name_id_seq RESTART WITH 1;
```

**To delete specific records:**
```sql
-- Always use WHERE clause
DELETE FROM table_name WHERE id = specific_id;
```

**To backup before destructive operations:**
```sql
-- Create backup first
pg_dump -U username -d database_name > backup_$(date +%Y%m%d).sql
```

### 🔒 INCIDENT LOG:

**2025-10-26**: Used `TRUNCATE insurance_details RESTART IDENTITY CASCADE` without warning. Result: Deleted ALL data from patient_details, doctor_details, appointment_details, department_details, and department_details_doctors tables due to foreign key CASCADE. **NEVER REPEAT THIS MISTAKE.**

---

## Project Overview
Multi-module Spring Boot application with two main sub-projects:
1. **DATAJPA** - Patient/Doctor management with JPA/Hibernate
2. **REST_API_s** - Student REST API with full CRUD operations

---

## Technology Stack
- **Spring Boot**: 3.1.5
- **Java**: 17 (compile target), Java 21+ (runtime available)
- **Database**: PostgreSQL (production), H2 (testing)
- **ORM**: Hibernate/JPA
- **Lombok**: 1.18.34 (for reducing boilerplate)
- **Security**: Spring Security with HTTP Basic Auth
- **Testing**: JUnit 5, Spring Boot Test, DataJpaTest
- **Mapping**: ModelMapper 3.1.1

---

## Project Structure
```
src/main/java/
├── DATAJPA/                        # Patient/Doctor JPA Module
│   ├── Entity/
│   │   ├── Patient.java           # Patient entity (patient_details table)
│   │   └── Doctor.java            # Doctor entity
│   ├── Repository/
│   │   └── PatientRepository.java # JPA repository with custom JPQL queries
│   ├── Service/
│   │   ├── PatientService.java
│   │   └── impl/PatientServiceImpl.java
│   ├── Controller/
│   │   └── PatientController.java
│   └── DataJPA_Application.java   # Main class (Port: 2222)
│
└── REST_API_s/                     # Student REST API Module
    ├── Entity/
    │   └── Student.java           # Student entity (student table)
    ├── Dto/
    │   └── Studentdto.java        # Student DTO
    ├── Repository/
    │   └── StudentRepository.java # JPA repository
    ├── Service/
    │   ├── StudentService.java
    │   └── impl/StudentServiceImpl.java
    ├── Controller/
    │   └── StrudentController.java # REST endpoints
    ├── Exception/
    │   ├── ResourceNotFoundException.java
    │   └── GlobalExceptionHandler.java # @ControllerAdvice
    ├── config/
    │   ├── SecurityConfig.java    # Security configuration
    │   └── Modelmapper.java       # ModelMapper bean
    └── Rest_Api_sApplication.java # Main class (Port: 1111)

src/test/java/
└── Spring_Boot/
    └── PatientRepositoryTest.java # 16 comprehensive JPA query tests

src/main/resources/
├── application-DataJPA.properties # DATAJPA config (Port: 2222)
└── application-rest.properties    # REST_API_s config (Port: 1111)

src/test/resources/
└── application.properties         # H2 in-memory DB config for tests
```

---

# MODULE 1: DATAJPA (Patient/Doctor Management)

## Server Configuration
- **Port**: 2222
- **Security credentials**: username=vk, password=vk123
- **Database**: PostgreSQL on localhost:5432/RestApi
- **Config file**: application-DataJPA.properties

## Patient Entity
```java
@Entity
@Table(name = "patient_details")
public class Patient {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "email")
    private String email;

    @Column(name = "gender")
    private String gender;

    @Column(name = "blood_group")
    private String bloodGroup;

    @Column(name = "birthdate")
    private String birthdate;
}
```

## PatientRepository Query Methods

### Spring Data JPA Method Naming Convention
- `Optional<Patient> findByEmail(String email)` - Find patient by email
- `List<Patient> findByName(String name)` - Find patients by exact name
- `List<Patient> findByGender(String gender)` - Find by gender
- `List<Patient> findByBloodGroup(String bloodGroup)` - Find by blood group
- `List<Patient> findByNameContaining(String name)` - Partial name search

### Custom JPQL Queries
```java
@Query("SELECT p FROM Patient p WHERE p.email = :email")
Optional<Patient> findPatientByEmail(@Param("email") String email);

@Query("SELECT p FROM Patient p WHERE LOWER(p.name) LIKE LOWER(CONCAT('%', :name, '%'))")
List<Patient> searchByName(@Param("name") String name);

@Query("SELECT p FROM Patient p WHERE p.gender = :gender AND p.bloodGroup = :bloodGroup")
List<Patient> findByGenderAndBloodGroup(@Param("gender") String gender, @Param("bloodGroup") String bloodGroup);

@Query("SELECT p FROM Patient p WHERE p.birthdate = :birthdate")
List<Patient> findByBirthdate(@Param("birthdate") String birthdate);
```

## Testing - PatientRepositoryTest

### Test Configuration
- **Location**: `src/test/java/Spring_Boot/PatientRepositoryTest.java`
- **Type**: `@DataJpaTest` - uses H2 in-memory database
- **Test Count**: 16 tests covering all query methods
- **Status**: ✅ All tests passing

### Test Coverage
1. Find by email (found/not found)
2. Find by name (single/multiple results)
3. Find by gender
4. Find by blood group
5. Partial name search
6. JPQL custom queries
7. Case-insensitive search
8. Multi-criteria queries
9. CRUD operations (save, update, delete)

### Running Tests
```bash
# Option 1: Using helper script (recommended)
./run-tests.sh

# Option 2: Using Maven with Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./mvnw clean test -Dtest=PatientRepositoryTest

# Option 3: From IDE
# Right-click on PatientRepositoryTest.java → Run Tests
```

### Test Results (Last Run)
```
Tests run: 16, Failures: 0, Errors: 0, Skipped: 0
BUILD SUCCESS
```

---

# MODULE 2: REST_API_s (Student Management)

## Server Configuration
- **Port**: 1111
- **Security credentials**: username=vk, password=vk1234
- **Database**: PostgreSQL on localhost:5432/RestApi
- **Config file**: application-rest.properties

## Student Entity
```java
@Entity
@Table(name = "student")
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 50, message = "Name must be between 2 and 50 characters")
    @Pattern(regexp = "^[a-zA-Z ]+$", message = "Name must only contain letters and spaces")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    private String email;
}
```

## REST API Endpoints

### Student Controller - `/students`

| Method | Endpoint | Description | Request Body | Response | Auth Required |
|--------|----------|-------------|--------------|----------|---------------|
| GET | `/students` | Get all students | - | `List<Studentdto>` | Yes |
| GET | `/students/{id}` | Get student by ID | - | `Studentdto` | Yes |
| POST | `/students` | Create new student | `Studentdto` | `Studentdto` (201) | Yes |
| PUT | `/students/{id}` | Update student (full) | `Studentdto` | `Studentdto` | Yes |
| PATCH | `/students/{id}` | Update student (partial) | `Studentdto` | `Studentdto` | Yes |
| DELETE | `/students/{id}` | Delete student | - | 204 No Content | Yes |
| HEAD | `/student/{id}` | Check if exists | - | 200 OK | Yes |
| OPTIONS | `/student` | Get allowed methods | - | 200 OK | Yes |

### Request/Response Examples

**Create Student (POST /students)**
```bash
curl -X POST http://localhost:1111/students \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic dms6dmsxMjM0" \
  -d '{
    "name": "Alice Johnson",
    "email": "alice@example.com"
  }'
```

**Response (201 Created)**
```json
{
  "id": 1,
  "name": "Alice Johnson",
  "email": "alice@example.com"
}
```

**Get All Students (GET /students)**
```bash
curl -X GET http://localhost:1111/students \
  -H "Authorization: Basic dms6dmsxMjM0"
```

**Update Student - Full (PUT /students/1)**
```bash
curl -X PUT http://localhost:1111/students/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic dms6dmsxMjM0" \
  -d '{
    "name": "Bob Smith",
    "email": "bob@example.com"
  }'
```

**Partial Update (PATCH /students/1)**
```bash
curl -X PATCH http://localhost:1111/students/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Basic dms6dmsxMjM0" \
  -d '{
    "name": "Charlie Brown"
  }'
```

**Delete Student (DELETE /students/1)**
```bash
curl -X DELETE http://localhost:1111/students/1 \
  -H "Authorization: Basic dms6dmsxMjM0"
```

## Service Layer

### StudentService Interface
```java
public interface StudentService {
    List<Studentdto> getAllStudents();
    Studentdto getStudentId(Long id);
    Studentdto createStudent(Studentdto studentdto);
    void deleteStudentbyId(Long id);
    Studentdto updateStudent(Studentdto studentdto, Long id);
    Studentdto patchStudent(Studentdto studentdto, Long id);
}
```

### StudentServiceImpl
- Uses **ModelMapper** for DTO ↔ Entity conversion
- Validates resource existence before operations
- Throws `ResourceNotFoundException` for missing records
- Implements full and partial update strategies

## Exception Handling

### Global Exception Handler (@ControllerAdvice)

**ResourceNotFoundException (404 NOT FOUND)**
```json
{
  "timestamp": "2024-10-26T10:30:45.123456",
  "status": 404,
  "error": "Not Found",
  "message": "Student not found with id: 5",
  "path": "/students/5"
}
```

**MethodArgumentNotValidException (400 BAD REQUEST)**
```json
{
  "name": "Name must only contain letters and spaces",
  "email": "Please provide a valid email address"
}
```

## Security Configuration

### SecurityConfig
```java
- CSRF Protection: DISABLED
- Public endpoints: /public/** (Permit All)
- All other endpoints: REQUIRE AUTHENTICATION
- Authentication: HTTP Basic Auth
- Form Login: DISABLED
```

**Authentication Header**
```
Authorization: Basic dms6dmsxMjM0
# base64(vk:vk1234)
```

---

# DATABASE CONFIGURATIONS

## Production (PostgreSQL)

### DATAJPA Module (Port: 2222)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/RestApi
spring.datasource.username=vikas
spring.datasource.password=vikas123
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.security.user.name=vk
spring.security.user.password=vk123
```

### REST_API_s Module (Port: 1111)
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/RestApi
spring.datasource.username=vikas
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.security.user.name=vk
spring.security.user.password=vk1234
```

## Testing (H2 In-Memory)
```properties
spring.datasource.url=jdbc:h2:mem:testdb
spring.datasource.driver-class-name=org.h2.Driver
spring.jpa.hibernate.ddl-auto=create-drop
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
spring.autoconfigure.exclude=org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration
```

---

# COMMON COMMANDS

## Build Commands
```bash
# Clean and build project
./mvnw clean install

# Build without tests
./mvnw clean install -DskipTests

# Compile only
./mvnw compile
```

## Run Applications
```bash
# Run DATAJPA application (Port: 2222)
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.config.name=application-DataJPA

# Run REST_API_s application (Port: 1111)
./mvnw spring-boot:run -Dspring-boot.run.arguments=--spring.config.name=application-rest
```

## Testing Commands
```bash
# Run all tests using helper script (recommended)
./run-tests.sh

# Run specific test class
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./mvnw test -Dtest=PatientRepositoryTest

# Run all tests
./mvnw test

# Run tests with coverage
./mvnw clean verify
```

---

# IMPORTANT TECHNICAL NOTES

## Java Version Compatibility
- **Project target**: Java 17
- **Maven compiler plugin**: 3.13.0 with Lombok annotation processing
- **Lombok version**: 1.18.34 (supports Java 17-21)
- **Runtime**: Use Java 21 for Maven builds (Java 25 has compatibility issues)
- **Available JDKs**: Java 21, Java 25

## Lombok Configuration
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-compiler-plugin</artifactId>
    <version>3.13.0</version>
    <configuration>
        <source>17</source>
        <target>17</target>
        <release>17</release>
        <annotationProcessorPaths>
            <path>
                <groupId>org.projectlombok</groupId>
                <artifactId>lombok</artifactId>
                <version>1.18.34</version>
            </path>
        </annotationProcessorPaths>
    </configuration>
</plugin>
```

## POM Issues to Note
- Duplicate junit dependency (warning in build)
- Maven wrapper script: `run-tests.sh` created to handle Java version

---

# DEPENDENCIES (Key)
- `spring-boot-starter-data-jpa` - JPA/Hibernate support
- `spring-boot-starter-web` - REST API support
- `spring-boot-starter-security` - Security features
- `spring-boot-starter-validation` - Bean validation
- `spring-boot-starter-test` - Testing framework
- `postgresql` - PostgreSQL driver
- `h2` - H2 in-memory database for testing
- `lombok` - Code generation (@Getter, @Setter, etc.)
- `modelmapper` - DTO-Entity mapping

---

# BEST PRACTICES FOR WORKING WITH CLAUDE CODE

## 1. Context Sharing
```bash
# Always reference this file at the start of new chats
"Read CLAUDE.md for project context"
```

## 2. File Operations
```bash
# Be specific about file paths
"Edit src/main/java/REST_API_s/Controller/StrudentController.java"

# Instead of generic requests like
"Update the student controller"
```

## 3. Testing
```bash
# Always run tests after changes
./run-tests.sh

# For specific modules, be explicit
"Run tests for PatientRepository only"
```

## 4. Module-Specific Work
```bash
# Specify which module you're working on
"Add a new endpoint to REST_API_s module"
"Create JPA query in DATAJPA module"

# This prevents confusion between the two sub-projects
```

## 5. Database Operations
```bash
# Be clear about database target
"Add query to PatientRepository (uses patient_details table)"
"Update Student entity (uses student table)"
```

## 6. Configuration Changes
```bash
# Specify which application.properties
"Update application-rest.properties for REST_API_s"
"Modify application-DataJPA.properties for DATAJPA"
```

## 7. Dependency Management
```bash
# When adding dependencies, use specific versions
"Add dependency X version Y to pom.xml"
"Check if dependency already exists before adding"
```

## 8. Build Issues
```bash
# Use Java 21 for builds (not Java 25)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

# Always clean before building after major changes
./mvnw clean compile
```

## 9. API Testing
```bash
# Specify the port for the module
"Test REST_API_s endpoints on port 1111"
"Test DATAJPA endpoints on port 2222"

# Include authentication
"Use Basic Auth with vk:vk1234 for REST_API_s"
"Use Basic Auth with vk:vk123 for DATAJPA"
```

## 10. Code Generation
```bash
# Leverage existing patterns
"Create a repository similar to PatientRepository"
"Add validation like in Student entity"

# Reference existing code
"Use the same exception handling as GlobalExceptionHandler"
```

## 11. Efficient Task Planning
```bash
# Break down complex tasks
"1. Add entity, 2. Create repository, 3. Add service, 4. Create controller, 5. Write tests"

# Claude Code works best with clear, sequential steps
```

## 12. Error Resolution
```bash
# Provide full error output
"./run-tests.sh failed with error: [paste full error]"

# Rather than
"Tests are failing"
```

## 13. Git Operations
```bash
# Be explicit about what to commit
"Commit only the REST_API_s changes"
"Create commit with message: Added student CRUD operations"
```

## 14. Documentation Updates
```bash
# Always update this file after major changes
"Update CLAUDE.md with new endpoints"
"Add new query methods to CLAUDE.md documentation"
```

## 15. Performance Optimization
```bash
# Use parallel tool calls when possible
"Read StudentController.java and StudentService.java in parallel"

# Claude Code can execute multiple independent reads simultaneously
```

---

# QUICK REFERENCE

## Module Comparison

| Feature | DATAJPA | REST_API_s |
|---------|---------|------------|
| Port | 2222 | 1111 |
| Main Class | DataJPA_Application | Rest_Api_sApplication |
| Config File | application-DataJPA.properties | application-rest.properties |
| Auth Password | vk123 | vk1234 |
| Primary Entity | Patient | Student |
| Table Name | patient_details | student |
| Has Tests | ✅ (16 tests) | ❌ (not yet) |
| Custom Queries | ✅ JPQL | ❌ (basic CRUD) |
| Exception Handling | Basic | ✅ @ControllerAdvice |
| DTO Pattern | ❌ | ✅ Studentdto |

## Common Troubleshooting

**For comprehensive debugging guide, see [ERRORS_AND_DEBUGGING.md](ERRORS_AND_DEBUGGING.md)**

### Build fails with Lombok errors
```bash
# Solution: Use Java 21
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
./mvnw clean compile
```

### Tests fail to run
```bash
# Solution: Use the helper script
./run-tests.sh

# Or check H2 dependency is present
```

### Application won't start
```bash
# Check PostgreSQL is running
psql -U vikas -d RestApi

# Check port is not in use
lsof -i :1111  # For REST_API_s
lsof -i :2222  # For DATAJPA
```

### 401 Unauthorized errors
```bash
# Check correct credentials for module
# REST_API_s: vk:vk1234
# DATAJPA: vk:vk123

# Generate correct Base64
echo -n "vk:vk1234" | base64  # For REST_API_s
```

### Blank screen when accessing endpoints
**See ERRORS_AND_DEBUGGING.md - Error #1: Infinite JSON Recursion**

Likely cause: Bidirectional entity relationships without Jackson annotations.
```bash
# Quick diagnosis
curl -v http://localhost:2222/Patients/2 -u admin:admin | head -100
```

---
 
??
---

**Last Updated**: 2024-10-26
**Project Status**: Active Development
**Test Coverage**: DATAJPA (100%), REST_API_s (0%)
