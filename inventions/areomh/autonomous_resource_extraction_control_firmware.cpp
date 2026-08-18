// REPOSITORY SOURCE: diplomat-bit/Citibank_Demo_Business_Inc_Demonstration- | PATH: diplomat-bit-Citibank_Demo_Business_Inc_Demonstration--ab2501d/inventions/areomh/autonomous_resource_extraction_control_firmware.cpp
================================================================================

```cpp
#pragma once // A pragmatic choice for a single-file firmware component

#include <iostream>
#include <vector>
#include <string>
#include <cmath>
#include <chrono>
#include <thread> // For simulated delays
#include <random> // For better random numbers
#include <ctime>  // For std::time
#include <map>    // For material properties, component status
#include <numeric> // For std::accumulate
#include <iomanip> // For std::setprecision

// Constants and global definitions (kept within namespace for good practice)
namespace AREOMH {
namespace Constants {
    const double GRAVITATIONAL_CONSTANT = 6.674e-11; // N(m/kg)^2 - G
    const double ASTEROID_REFERENCE_MASS = 1.0e12; // kg (example asteroid mass for F_grav calculation)
    const double ROBOT_MASS = 1500.0; // kg
    const double ASTEROID_ROTATION_STABILITY_THRESHOLD = 0.005; // rad/s (tolerance for angular velocity magnitude)
    const double EXTRACTION_DEPTH_TARGET = 5.0; // meters
    const double SCAN_RESOLUTION_METERS = 0.1; // meters per lidar scan point
    const int MATERIAL_BUFFER_CAPACITY = 1000; // units
    const double NAVIGATION_APPROACH_DISTANCE = 10.0; // meters, when to switch to fine approach
    const double NAVIGATION_TARGET_DISTANCE_TOLERANCE = 0.1; // meters, considered arrived
    const double THRUST_MAGNITUDE_NAV = 1000.0; // N for navigation
    const double THRUST_MAGNITUDE_STAB = 50.0; // N for stabilization
    const double MAX_DRILL_WEAR = 1.0; // Max wear before replacement/maintenance (1.0 = 100% worn)
    const double MAX_POWER_CONSUMPTION = 1000.0; // Watts
    const double CRITICAL_TEMPERATURE = 80.0; // Celsius
    const double COMMUNICATION_RANGE = 100000.0; // meters (example)
    const double BASE_STATION_LATENCY_MS = 100.0; // ms
    const double ASTEROID_STRUCTURAL_INTEGRITY_THRESHOLD = 0.8; // Ratio, below which drilling is risky
} // namespace Constants

// --- Utility Functions and Basic Types ---
struct Vector3D {
    double x, y, z;

    Vector3D operator+(const Vector3D& other) const { return {x + other.x, y + other.y, z + other.z}; }
    Vector3D operator-(const Vector3D& other) const { return {x - other.x, y - other.y, z - other.z}; }
    Vector3D operator*(double scalar) const { return {x * scalar, y * scalar, z * scalar}; }
    Vector3D operator/(double scalar) const { return {x / scalar, y / scalar, z / scalar}; }
    double magnitude() const { return std::sqrt(x*x + y*y + z*z); }
    Vector3D normalized() const {
        double mag = magnitude();
        return mag > 0 ? (*this) / mag : Vector3D{0,0,0};
    }
    double dot(const Vector3D& other) const { return x * other.x + y * other.y + z * other.z; }
    Vector3D cross(const Vector3D& other) const {
        return {y * other.z - z * other.y,
                z * other.x - x * other.z,
                x * other.y - y * other.x};
    }
};

struct Quaternion {
    double w, x, y, z; // For orientation
    // Expanded for basic functionality required for 'bulletproof'
    Quaternion() : w(1.0), x(0.0), y(0.0), z(0.0) {}
    Quaternion(double nw, double nx, double ny, double nz) : w(nw), x(nx), y(ny), z(nz) {}

    // Simplified normalization
    Quaternion normalized() const {
        double mag = std::sqrt(w*w + x*x + y*y + z*z);
        return mag > 0 ? Quaternion{w/mag, x/mag, y/mag, z/mag} : Quaternion{};
    }

    // Simplified multiplication (q1 * q2)
    Quaternion operator*(const Quaternion& r) const {
        return {
            w * r.w - x * r.x - y * r.y - z * r.z,
            w * r.x + x * r.w + y * r.z - z * r.y,
            w * r.y - x * r.z + y * r.w + z * r.x,
            w * r.z + x * r.y - y * r.x + z * r.w
        };
    }

    // Rotate a vector by this quaternion
    Vector3D rotate(const Vector3D& v) const {
        Quaternion p = {0.0, v.x, v.y, v.z};
        Quaternion q_conj = {w, -x, -y, -z}; // Conjugate
        Quaternion rotated_p = (*this) * p * q_conj;
        return {rotated_p.x, rotated_p.y, rotated_p.z};
    }
};

struct OrbitalParameters {
    Vector3D position;
    Vector3D velocity;
    double mass;
    Vector3D angular_velocity; // For asteroids
};

struct MaterialProperties {
    std::string type;
    double density; // kg/m^3
    double hardness; // Mohs scale or similar
    double thermal_conductivity; // W/(m*K)
    double value_per_unit; // Credits/unit
};

enum class ErrorCode {
    NONE,
    SENSOR_FAILURE,
    ACTUATOR_FAILURE,
    NAVIGATION_ERROR,
    COMMUNICATION_LOST,
    POWER_CRITICAL,
    THERMAL_OVERLOAD,
    RESOURCE_DEPLETION,
    STRUCTURAL_INTEGRITY_COMPROMISED,
    UNKNOWN_ERROR,
    DRILL_WEAR_CRITICAL,
    BUFFER_OVERFLOW,
    ATTACHMENT_FAILURE,
    ASTEROID_INSTABILITY,
    LOGIC_CONSTRAINT_VIOLATION,
    NO_SUITABLE_SITE
};

std::string toString(ErrorCode ec) {
    switch(ec) {
        case ErrorCode::NONE: return "NONE";
        case ErrorCode::SENSOR_FAILURE: return "SENSOR_FAILURE";
        case ErrorCode::ACTUATOR_FAILURE: return "ACTUATOR_FAILURE";
        case ErrorCode::NAVIGATION_ERROR: return "NAVIGATION_ERROR";
        case ErrorCode::COMMUNICATION_LOST: return "COMMUNICATION_LOST";
        case ErrorCode::POWER_CRITICAL: return "POWER_CRITICAL";
        case ErrorCode::THERMAL_OVERLOAD: return "THERMAL_OVERLOAD";
        case ErrorCode::RESOURCE_DEPLETION: return "RESOURCE_DEPLETION";
        case ErrorCode::STRUCTURAL_INTEGRITY_COMPROMISED: return "STRUCTURAL_INTEGRITY_COMPROMISED";
        case ErrorCode::UNKNOWN_ERROR: return "UNKNOWN_ERROR";
        case ErrorCode::DRILL_WEAR_CRITICAL: return "DRILL_WEAR_CRITICAL";
        case ErrorCode::BUFFER_OVERFLOW: return "BUFFER_OVERFLOW";
        case ErrorCode::ATTACHMENT_FAILURE: return "ATTACHMENT_FAILURE";
        case ErrorCode::ASTEROID_INSTABILITY: return "ASTEROID_INSTABILITY";
        case ErrorCode::LOGIC_CONSTRAINT_VIOLATION: return "LOGIC_CONSTRAINT_VIOLATION";
        case ErrorCode::NO_SUITABLE_SITE: return "NO_SUITABLE_SITE";
        default: return "UNDEFINED_ERROR";
    }
}

// Global random engine for all simulations
static std::default_random_engine global_generator(std::time(nullptr));

// --- Sensor Abstractions (Expanded for Robustness) ---
class Sensor {
protected:
    std::string name_;
    double reliability_ = 1.0; // 0.0 to 1.0
    bool active_ = true;
    ErrorCode last_error_ = ErrorCode::NONE;

public:
    Sensor(const std::string& name) : name_(name) {}
    virtual ~Sensor() = default;

    void activate() { active_ = true; last_error_ = ErrorCode::NONE; std::cout << "[" << name_ << "] Activated.\n"; }
    void deactivate() { active_ = false; std::cout << "[" << name_ << "] Deactivated.\n"; }
    bool isActive() const { return active_; }
    ErrorCode getLastError() const { return last_error_; }
    void setReliability(double rel) { reliability_ = std::max(0.0, std::min(1.0, rel)); }

    // Simulate sensor failure
    bool mightFail() const {
        std::uniform_real_distribution<double> dist(0.0, 1.0);
        if (dist(global_generator) > reliability_) {
            last_error_ = ErrorCode::SENSOR_FAILURE;
            std::cout << "[" << name_ << "] WARNING: Sensor failure simulated!\n";
            return true;
        }
        last_error_ = ErrorCode::NONE;
        return false;
    }
};

class InertialMeasurementUnit : public Sensor {
private:
    Vector3D acceleration_offset_ = {0.0, 0.0, 0.0};
    Vector3D angular_velocity_offset_ = {0.0, 0.0, 0.0};
    Quaternion orientation_offset_ = {1.0, 0.0, 0.0, 0.0};

public:
    InertialMeasurementUnit() : Sensor("IMU") {}

    Vector3D getAcceleration() {
        if (mightFail() || !isActive()) return {0,0,0};
        std::normal_distribution<double> noise(0.0, 0.005);
        return {noise(global_generator) + acceleration_offset_.x,
                noise(global_generator) + acceleration_offset_.y,
                noise(global_generator) + acceleration_offset_.z};
    }

    Vector3D getAngularVelocity() {
        if (mightFail() || !isActive()) return {0,0,0};
        std::normal_distribution<double> noise(0.0, 0.0001);
        // Simulating some asteroid rotation for testing stabilization
        static std::uniform_real_distribution<double> distribution(-0.01, 0.01);
        return {distribution(global_generator) + angular_velocity_offset_.x + noise(global_generator),
                distribution(global_generator) + angular_velocity_offset_.y + noise(global_generator),
                distribution(global_generator) + angular_velocity_offset_.z + noise(global_generator)};
    }

    Quaternion getOrientation() {
        if (mightFail() || !isActive()) return {1.0, 0.0, 0.0, 0.0};
        // In a real system, this would integrate angular velocity over time.
        // For simulation, we return a stable identity or a slowly drifting one.
        return orientation_offset_;
    }

    void calibrate() {
        std::cout << "[" << name_ << "] Calibrating... Expect a few g-forces. Totally normal, just ignore the sparks.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        acceleration_offset_ = {0.0, 0.0, 0.0}; // Reset offsets after calibration
        angular_velocity_offset_ = {0.0, 0.0, 0.0};
        orientation_offset_ = {1.0, 0.0, 0.0, 0.0};
        std::cout << "[" << name_ << "] Calibration complete. Ready for some aggressive maneuvering, or gentle floating.\n";
        last_error_ = ErrorCode::NONE;
    }
};

class LidarScanner : public Sensor {
private:
    double range_ = 100.0; // Max scanning range in meters
    double angle_resolution_ = 0.5; // degrees
    int points_per_scan_ = 500;

public:
    LidarScanner() : Sensor("LidarScanner") {}

    std::vector<Vector3D> scanEnvironment(const Vector3D& robot_pos, const Quaternion& robot_orientation) {
        if (mightFail() || !isActive()) return {};
        std::cout << "[" << name_ << "] Scanning environment for obstacles and terrain features... Hopefully no space-kraken.\n";
        // Simulate a more detailed scan:
        // Generate points in robot's local frame, then transform to global.
        std::vector<Vector3D> points;
        std::uniform_real_distribution<double> dist_range(1.0, range_ / 2.0); // Assume objects are within half range
        std::uniform_real_distribution<double> dist_angle(-M_PI, M_PI); // Full 360 scan for simplicity

        for (int i = 0; i < points_per_scan_; ++i) {
            double r = dist_range(global_generator);
            double theta = dist_angle(global_generator); // Yaw
            double phi = std::acos(2 * std::uniform_real_distribution<double>(-1.0, 1.0)(global_generator) - 1.0); // Pitch, spherical coordinates
            
            // Convert spherical to Cartesian in sensor's frame
            Vector3D local_point = {
                r * std::sin(phi) * std::cos(theta),
                r * std::sin(phi) * std::sin(theta),
                r * std::cos(phi)
            };
            
            // Transform local point to global coordinates
            points.push_back(robot_pos + robot_orientation.rotate(local_point));
        }
        return points;
    }

    double measureDistanceToSurface() {
        if (mightFail() || !isActive()) return -1.0;
        std::normal_distribution<double> noise(0.0, 0.1);
        // Simulate surface distance with some noise
        return 5.0 + (static_cast<double>(std::rand()) / RAND_MAX * 5.0) + noise(global_generator); // 5.0 to 10.0 meters
    }
    
    // New: detect structural integrity of the asteroid surface
    double assessStructuralIntegrity(const Vector3D& target_coords) {
        if (mightFail() || !isActive()) return 0.0; // 0.0 indicates critical failure
        std::cout << "[" << name_ << "] Assessing structural integrity near ("
                  << target_coords.x << ", " << target_coords.y << ", " << target_coords.z << "). This rock needs to hold up.\n";
        std::uniform_real_distribution<double> dist(0.7, 1.0); // Simulate varying integrity
        return dist(global_generator);
    }
};

class MaterialSpectrometer : public Sensor {
private:
    std::map<std::string, MaterialProperties> known_materials_;

public:
    MaterialSpectrometer() : Sensor("Spectrometer") {
        known_materials_["Silicate"] = {"Silicate", 2500, 6.0, 2.0, 10.0};
        known_materials_["Iron-Nickel"] = {"Iron-Nickel", 7800, 4.5, 80.0, 100.0};
        known_materials_["Volatiles"] = {"Volatiles", 500, 1.0, 0.5, 50.0}; // Ice, gasses etc.
        known_materials_["Rare Earths"] = {"Rare Earths", 4000, 5.0, 15.0, 500.0};
        known_materials_["Unknown Anomaly"] = {"Unknown Anomaly", 1000, 2.0, 1.0, 0.0}; // Placeholder for unknown
    }

    MaterialProperties analyzeMaterial(const Vector3D& location) {
        if (mightFail() || !isActive()) return {"Failed Scan", 0, 0, 0, 0};
        std::cout << "[" << name_ << "] Analyzing material composition at (" << location.x << ", " << location.y << ", " << location.z
                  << ")... Please hold, science in progress. Probably just rock, but maybe space diamonds!\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));

        std::uniform_int_distribution<int> material_dist(0, known_materials_.size() - 1);
        auto it = known_materials_.begin();
        std::advance(it, material_dist(global_generator));

        std::uniform_real_distribution<double> certainty_dist(0.7, 1.0);
        double certainty = certainty_dist(global_generator);

        if (certainty < 0.8) { // Simulate uncertain reading or new material
            std::cout << "[" << name_ << "] WARNING: Low confidence in material analysis. Detected " << it->first << " with "
                      << std::fixed << std::setprecision(2) << certainty * 100 << "% certainty.\n";
            if (certainty < 0.6) return known_materials_["Unknown Anomaly"];
        }
        return it->second;
    }
};

class VisionSystem : public Sensor {
public:
    VisionSystem() : Sensor("VisionSystem") {}

    // Simulate capturing a visual frame, returning key features
    std::vector<Vector3D> detectFeatures(const Vector3D& robot_pos, const Quaternion& robot_orientation) {
        if (mightFail() || !isActive()) return {};
        std::cout << "[" << name_ << "] Capturing visual data, identifying navigation features and potential hazards.\n";
        std::vector<Vector3D> features;
        std::uniform_real_distribution<double> dist(-10.0, 10.0);
        for (int i = 0; i < 20; ++i) { // Simulate 20 detected features
            features.push_back(robot_pos + robot_orientation.rotate({dist(global_generator), dist(global_generator), dist(global_generator)}));
        }
        return features;
    }

    // Simulate identifying potential attachment points visually
    std::vector<Vector3D> identifyAttachmentPoints(const std::vector<Vector3D>& lidar_scan) {
        if (mightFail() || !isActive()) return {};
        std::cout << "[" << name_ << "] Analyzing visual and lidar data to identify robust attachment points.\n";
        // In a real system, this would involve complex image processing and 3D reconstruction.
        // For simulation, we filter lidar points to find 'stable' ones.
        std::vector<Vector3D> attachment_points;
        for (const auto& p : lidar_scan) {
            // Heuristic: points on a relatively flat surface suitable for grappling
            // Z-coordinate check might mean it's on the 'equator' or accessible part.
            if (p.z > -2.0 && p.z < 2.0 && p.magnitude() > 2.0) { // Avoid points too close to robot or too vertical
                attachment_points.push_back(p);
            }
        }
        if (attachment_points.empty() && !lidar_scan.empty()) { // Fallback if no ideal points
            attachment_points.push_back(lidar_scan[0]);
        }
        return attachment_points;
    }
};

class CommunicationModule : public Sensor { // Treated as a sensor for monitoring link quality
private:
    double link_strength_ = 1.0; // 0.0 (no signal) to 1.0 (perfect)
    Vector3D base_station_position_ = {0.0, 0.0, 0.0};

public:
    CommunicationModule() : Sensor("Comms") {}

    void setBaseStationPosition(const Vector3D& pos) { base_station_position_ = pos; }

    bool sendTelemetry(const std::string& data, const Vector3D& current_pos) {
        if (mightFail() || !isActive()) {
            std::cout << "[" << name_ << "] WARNING: Failed to send telemetry due to module error or inactivity.\n";
            return false;
        }
        double distance = (current_pos - base_station_position_).magnitude();
        // Link strength drops with distance, simulating inverse square law or similar.
        // Also add a small random fluctuation.
        std::uniform_real_distribution<double> noise_dist(-0.05, 0.05);
        link_strength_ = std::max(0.0, 1.0 - (distance / Constants::COMMUNICATION_RANGE)) + noise_dist(global_generator);
        link_strength_ = std::max(0.0, std::min(1.0, link_strength_)); // Clamp between 0 and 1

        if (link_strength_ < 0.2) { // Critical link strength
            last_error_ = ErrorCode::COMMUNICATION_LOST;
            std::cout << "[" << name_ << "] CRITICAL: Communication link to base lost! Data: " << data << "\n";
            return false;
        }

        std::cout << "[" << name_ << "] Telemetry sent (Link: " << std::fixed << std::setprecision(2) << link_strength_ * 100 << "%): " << data << "\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(static_cast<int>(Constants::BASE_STATION_LATENCY_MS / link_strength_)));
        return true;
    }

    std::string receiveCommand() {
        if (mightFail() || !isActive() || link_strength_ < 0.2) return "";
        // Simulate command reception
        std::uniform_int_distribution<int> dist(0, 100);
        if (dist(global_generator) < 5) { // 5% chance of a command
            std::string commands[] = {"RECALIBRATE_IMU", "RETRIEVE_ABORT", "OPTIMIZE_DRILL_RPM", "REPORT_STATUS"};
            std::cout << "[" << name_ << "] Command received: " << commands[dist(global_generator) % 4] << "\n";
            return commands[dist(global_generator) % 4];
        }
        return "";
    }
};

// --- Actuator Abstractions (Expanded for Robustness) ---
class Actuator {
protected:
    std::string name_;
    double reliability_ = 1.0; // 0.0 to 1.0
    bool active_ = true;
    ErrorCode last_error_ = ErrorCode::NONE;

public:
    Actuator(const std::string& name) : name_(name) {}
    virtual ~Actuator() = default;

    void activate() { active_ = true; last_error_ = ErrorCode::NONE; std::cout << "[" << name_ << "] Activated.\n"; }
    void deactivate() { active_ = false; std::cout << "[" << name_ << "] Deactivated.\n"; }
    bool isActive() const { return active_; }
    ErrorCode getLastError() const { return last_error_; }
    void setReliability(double rel) { reliability_ = std::max(0.0, std::min(1.0, rel)); }

    // Simulate actuator failure
    bool mightFail() const {
        std::uniform_real_distribution<double> dist(0.0, 1.0);
        if (dist(global_generator) > reliability_) {
            last_error_ = ErrorCode::ACTUATOR_FAILURE;
            std::cout << "[" << name_ << "] WARNING: Actuator failure simulated!\n";
            return true;
        }
        last_error_ = ErrorCode::NONE;
        return false;
    }
};

class ThrusterControl : public Actuator {
public: // Made public for easier simulation of repair
    std::map<int, bool> thruster_health_; // Individual thruster health

public:
    ThrusterControl() : Actuator("Thrusters") {
        for (int i = 0; i < 8; ++i) thruster_health_[i] = true; // 8 thrusters for redundancy
    }

    void applyThrust(const Vector3D& direction, double magnitude) {
        if (mightFail() || !isActive()) return; // General module failure
        if (magnitude <= 0) return;

        int operational_thrusters = 0;
        for (const auto& pair : thruster_health_) {
            if (pair.second) operational_thrusters++;
        }

        if (operational_thrusters == 0) {
            last_error_ = ErrorCode::ACTUATOR_FAILURE;
            std::cout << "[" << name_ << "] CRITICAL: All thrusters offline! Cannot apply thrust.\n";
            return;
        }

        // Simulate individual thruster failure affecting total thrust
        std::uniform_real_distribution<double> dist(0.0, 1.0);
        for (int i = 0; i < thruster_health_.size(); ++i) {
            if (thruster_health_[i] && dist(global_generator) < (1.0 - reliability_) * 0.1) { // Small chance even if module is 'fine'
                thruster_health_[i] = false;
                std::cout << "[" << name_ << "] WARNING: Thruster " << i << " failed!\n";
            }
        }
        
        double effective_magnitude = magnitude * (static_cast<double>(operational_thrusters) / thruster_health_.size());

        std::cout << "[" << name_ << "] Applying " << effective_magnitude << "N thrust in direction ("
                  << std::fixed << std::setprecision(2) << direction.x << ", " << direction.y << ", " << direction.z << "). Zipping along! ("
                  << operational_thrusters << "/" << thruster_health_.size() << " operational)\n";
    }

    void stabilizeRotation(const Vector3D& angularVelocity) {
        if (mightFail() || !isActive()) return;
        if (angularVelocity.magnitude() > 0) {
            std::cout << "[" << name_ << "] Countering asteroid rotation ("
                      << std::fixed << std::setprecision(4) << angularVelocity.x << ", " << angularVelocity.y << ", " << angularVelocity.z << "). Keeping things steady, because nobody likes a spinning office.\n";
            applyThrust(angularVelocity.normalized() * -1.0, Constants::THRUST_MAGNITUDE_STAB); // Simplified counter-thrust
        }
    }

    int getOperationalThrusterCount() const {
        int count = 0;
        for (const auto& pair : thruster_health_) {
            if (pair.second) count++;
        }
        return count;
    }

    void repairThruster(int index) {
        if (index >= 0 && index < thruster_health_.size()) {
            thruster_health_[index] = true;
            std::cout << "[" << name_ << "] Thruster " << index << " repaired.\n";
        }
    }
};

class ManipulatorArm : public Actuator {
private:
    double drill_wear_ = 0.0; // 0.0 (new) to 1.0 (worn out)
    bool attached_ = false;

public:
    ManipulatorArm() : Actuator("ManipulatorArm") {}

    bool extend() {
        if (mightFail() || !isActive()) return false;
        std::cout << "[" << name_ << "] Extending manipulator arm. Reaching for the stars, or at least some valuable rock.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        return true;
    }
    bool retract() {
        if (mightFail() || !isActive()) return false;
        std::cout << "[" << name_ << "] Retracting manipulator arm. Safety first, then more rock.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        return true;
    }
    bool grab(const std::string& target) {
        if (mightFail() || !isActive()) return false;
        std::cout << "[" << name_ << "] Grabbing " << target << ". Gotcha! Hope it's not sentient.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        attached_ = true;
        return true;
    }
    bool release() {
        if (mightFail() || !isActive()) return false;
        std::cout << "[" << name_ << "] Releasing. Freedom for the rock! (Into our collection, that is).\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(500));
        attached_ = false;
        return true;
    }

    bool drillAt(const Vector3D& target_coords, double depth, const MaterialProperties& material) {
        if (mightFail() || !isActive()) return false;
        if (drill_wear_ >= Constants::MAX_DRILL_WEAR) {
            last_error_ = ErrorCode::DRILL_WEAR_CRITICAL;
            std::cout << "[" << name_ << "] CRITICAL: Drill bit is too worn! Cannot drill.\n";
            return false;
        }

        std::cout << "[" << name_ << "] Initiating drilling at (" << std::fixed << std::setprecision(2) << target_coords.x << ", " << target_coords.y << ", " << target_coords.z
                  << ") to depth " << depth << "m into " << material.type << ". Prepare for impact! (Of our drill bit, that is).\n";
        
        // Simulate drilling time and wear based on depth and material hardness
        double drill_time_sec = depth * (material.hardness / 5.0) * 0.5; // Harder materials take longer
        std::this_thread::sleep_for(std::chrono::seconds(static_cast<int>(drill_time_sec) + 1));
        
        drill_wear_ += (depth * material.hardness * 0.01); // Accumulate wear
        if (drill_wear_ > Constants::MAX_DRILL_WEAR) drill_wear_ = Constants::MAX_DRILL_WEAR; // Cap wear

        std::cout << "[" << name_ << "] Drilling complete. Current drill wear: "
                  << std::fixed << std::setprecision(2) << drill_wear_ * 100 << "%. We're in, and probably found something cool.\n";
        return true;
    }

    double getDrillWear() const { return drill_wear_; }
    void replaceDrillBit() {
        std::cout << "[" << name_ << "] Replacing drill bit. Fresh steel for fresh rock!\n";
        drill_wear_ = 0.0;
        std::this_thread::sleep_for(std::chrono::seconds(5)); // Simulate complex replacement
        std::cout << "[" << name_ << "] Drill bit replaced. Ready for more action.\n";
        last_error_ = ErrorCode::NONE;
    }
    bool isAttached() const { return attached_; }
};

class MaterialConveyor : public Actuator {
public:
    MaterialConveyor() : Actuator("Conveyor") {}
    void activate() { if (mightFail() || !isActive()) return; std::cout << "[" << name_ << "] Activating material conveyor. Flowing wealth! Or just dust, sometimes.\n"; }
    void deactivate() { if (mightFail() || !isActive()) return; std::cout << "[" << name_ << "] Deactivating material conveyor. Pausing the gold rush, briefly.\n"; }
    
    bool loadMaterial(const std::string& material_type, int quantity, int& current_buffer) {
        if (mightFail() || !isActive()) return false;

        if (current_buffer + quantity > Constants::MATERIAL_BUFFER_CAPACITY) {
            int actual_quantity = Constants::MATERIAL_BUFFER_CAPACITY - current_buffer;
            if (actual_quantity > 0) {
                current_buffer += actual_quantity;
                std::cout << "[" << name_ << "] WARNING: Buffer full, loaded only partial amount (" << actual_quantity << " units).\n";
            } else {
                last_error_ = ErrorCode::BUFFER_OVERFLOW;
                std::cout << "[" << name_ << "] CRITICAL: Buffer is already full, cannot load any more material.\n";
                return false;
            }
        } else {
            current_buffer += quantity;
            std::cout << "[" << name_ << "] Loaded " << quantity << " units of " << material_type
                      << ". Buffer: " << current_buffer << "/" << Constants::MATERIAL_BUFFER_CAPACITY << "\n";
        }
        return true;
    }
    int unloadMaterial(int& current_buffer) {
        if (mightFail() || !isActive()) return 0;
        int unloaded = current_buffer;
        current_buffer = 0;
        std::cout << "[" << name_ << "] Unloaded all " << unloaded << " units of material. Excellent work, team!\n";
        return unloaded;
    }
    bool isFull(int current_buffer) const { return current_buffer >= Constants::MATERIAL_BUFFER_CAPACITY; }
    bool isEmpty(int current_buffer) const { return current_buffer == 0; }
};

class RefineryUnit : public Actuator {
public:
    RefineryUnit() : Actuator("Refinery") {}

    MaterialProperties processMaterial(const MaterialProperties& raw_material, int quantity) {
        if (mightFail() || !isActive()) return {"Failed Processing", 0, 0, 0, 0};
        std::cout << "[" << name_ << "] Processing " << quantity << " units of " << raw_material.type
                  << ". Refining raw space-stuff into shiny future-stuff. This is where the magic (and a lot of energy) happens.\n";
        
        std::this_thread::sleep_for(std::chrono::seconds(3));
        
        // Simulate purity increase, value increase for processed material
        MaterialProperties processed = raw_material;
        processed.type = "Refined " + raw_material.type;
        processed.value_per_unit *= 1.5; // 50% value increase
        std::cout << "[" << name_ << "] Material refined. Ready for transport to orbital manufacturing hub. One step closer to self-replicating robots!\n";
        return processed;
    }
};

// --- System Management Modules ---
class PowerManagementUnit : public Actuator {
private:
    double current_power_draw_ = 0.0; // Watts
    double max_capacity_ = 5000.0; // Total power capacity
    double current_charge_ = 100.0; // % charge of main battery
    double efficiency_ = 0.9; // Power conversion efficiency

public:
    PowerManagementUnit() : Actuator("PowerUnit") {}

    bool requestPower(double watts) {
        if (mightFail() || !isActive()) return false;
        double actual_watts = watts / efficiency_; // Account for conversion loss
        if (current_power_draw_ + actual_watts > max_capacity_ || current_charge_ < 10.0) { // Simple low charge threshold
            last_error_ = ErrorCode::POWER_CRITICAL;
            std::cout << "[" << name_ << "] CRITICAL: Power request (" << watts << "W) denied. Overload or low charge ("
                      << std::fixed << std::setprecision(1) << current_charge_ << "%).\n";
            return false;
        }
        current_power_draw_ += actual_watts;
        current_charge_ -= (actual_watts / max_capacity_) * 0.01; // Simulate charge drain
        std::cout << "[" << name_ << "] Power allocated: " << watts << "W. Current draw: "
                  << std::fixed << std::setprecision(1) << current_power_draw_ << "W. Charge: " << current_charge_ << "%\n";
        return true;
    }

    void releasePower(double watts) {
        if (!isActive()) return;
        current_power_draw_ = std::max(0.0, current_power_draw_ - (watts / efficiency_));
        std::cout << "[" << name_ << "] Power released: " << watts << "W. Current draw: "
                  << std::fixed << std::setprecision(1) << current_power_draw_ << "W.\n";
    }

    double getCurrentDraw() const { return current_power_draw_; }
    double getChargeLevel() const { return current_charge_; }
    
    void recharge(double amount) { // Simulate solar panels or internal reactor
        current_charge_ = std::min(100.0, current_charge_ + amount);
        std::cout << "[" << name_ << "] Recharging. Current charge: " << std::fixed << std::setprecision(1) << current_charge_ << "%\n";
    }
};

class ThermalManagementUnit : public Actuator {
private:
    double current_temperature_c_ = 25.0; // Celsius
    double heat_dissipation_rate_ = 10.0; // C/s (simplified)

public:
    ThermalManagementUnit() : Actuator("ThermalUnit") {}

    void regulateTemperature(double ambient_temp, double heat_generated) {
        if (mightFail() || !isActive()) return;
        current_temperature_c_ += (heat_generated / 100.0); // Heat generated proportional to power draw
        current_temperature_c_ = std::max(ambient_temp, current_temperature_c_ - heat_dissipation_rate_); // Dissipate heat

        if (current_temperature_c_ > Constants::CRITICAL_TEMPERATURE) {
            last_error_ = ErrorCode::THERMAL_OVERLOAD;
            std::cout << "[" << name_ << "] CRITICAL: Thermal overload detected! Temperature: "
                      << std::fixed << std::setprecision(1) << current_temperature_c_ << "C.\n";
        } else if (current_temperature_c_ > (Constants::CRITICAL_TEMPERATURE * 0.8)) {
            std::cout << "[" << name_ << "] WARNING: High temperature. Current: "
                      << std::fixed << std::setprecision(1) << current_temperature_c_ << "C. Engaging active cooling.\n";
        } else {
            std::cout << "[" << name_ << "] Temperature nominal: "
                      << std::fixed << std::setprecision(1) << current_temperature_c_ << "C.\n";
        }
    }
    double getCurrentTemperature() const { return current_temperature_c_; }
};

class HealthMonitorSystem {
private:
    std::string robot_id_;
    std::map<std::string, ErrorCode> component_errors_; // Map component name to its last error
    std::map<std::string, double> component_health_metrics_; // e.g., drill wear, thruster count ratio

public:
    HealthMonitorSystem(const std::string& robot_id) : robot_id_(robot_id) {}

    void reportComponentStatus(const std::string& component_name, ErrorCode error, double health_metric = 1.0) {
        component_errors_[component_name] = error;
        component_health_metrics_[component_name] = health_metric;
    }

    bool isSystemHealthy() const {
        for (const auto& pair : component_errors_) {
            if (pair.second != ErrorCode::NONE) {
                // std::cout << "[HEALTH] System unhealthy: " << pair.first << " reports error " << toString(pair.second) << "\n";
                return false;
            }
        }
        for (const auto& pair : component_health_metrics_) {
            if (pair.first == "drill_wear" && pair.second >= Constants::MAX_DRILL_WEAR) {
                 // std::cout << "[HEALTH] System unhealthy: Drill wear critical (" << pair.second * 100 << "%).\n";
                 return false;
            }
            if (pair.first == "thruster_count_ratio" && pair.second < 0.5) { // Less than 50% thrusters
                // std::cout << "[HEALTH] System unhealthy: Thruster redundancy critical (" << pair.second * 100 << "%).\n";
                return false;
            }
            if (pair.first == "PowerManagementUnit" && pair.second < 0.1) { // 10% charge
                // std::cout << "[HEALTH] System unhealthy: Power critically low (" << pair.second * 100 << "% charge).\n";
                return false;
            }
            if (pair.first == "ThermalManagementUnit" && pair.second > 1.0) { // Above critical temp
                // std::cout << "[HEALTH] System unhealthy: Thermal critically high (" << (metric_pair.second * Constants::CRITICAL_TEMPERATURE) << "C).\n";
                return false;
            }
        }
        return true;
    }

    ErrorCode getOverallSystemError() const {
        for (const auto& pair : component_errors_) {
            if (pair.second != ErrorCode::NONE) return pair.second;
        }
        return ErrorCode::NONE;
    }

    std::map<std::string, ErrorCode> getAllErrors() const { return component_errors_; }
    std::map<std::string, double> getAllHealthMetrics() const { return component_health_metrics_; }
};

// --- Robot State and Core Logic ---
enum class RobotState {
    IDLE,
    PRE_FLIGHT_CHECK,
    NAVIGATING_TO_ASTEROID,
    APPROACHING_ASTEROID, // New intermediate state
    ATTACHING_TO_ASTEROID,
    STABILIZING_ASTEROID, // New dedicated state
    SCANNING_SURFACE,
    ANALYZING_MATERIAL,
    SELECTING_DRILL_SITE, // New refined state
    DRILLING,
    EXTRACTING_MATERIAL,
    PROCESSING_MATERIAL,
    DELIVERING_MATERIAL,
    RETURNING_TO_HUB,
    UNLOADING_MATERIAL,
    REPAIRING_SELF, // New state for self-repair
    EMERGENCY_ABORT,
    HIBERNATION, // New state for long-term power saving
    WAITING_FOR_COMMAND // New state for comms based commands
};

std::string toString(RobotState state) {
    switch (state) {
        case RobotState::IDLE: return "IDLE";
        case RobotState::PRE_FLIGHT_CHECK: return "PRE_FLIGHT_CHECK";
        case RobotState::NAVIGATING_TO_ASTEROID: return "NAVIGATING_TO_ASTEROID";
        case RobotState::APPROACHING_ASTEROID: return "APPROACHING_ASTEROID";
        case RobotState::ATTACHING_TO_ASTEROID: return "ATTACHING_TO_ASTEROID";
        case RobotState::STABILIZING_ASTEROID: return "STABILIZING_ASTEROID";
        case RobotState::SCANNING_SURFACE: return "SCANNING_SURFACE";
        case RobotState::ANALYZING_MATERIAL: return "ANALYZING_MATERIAL";
        case RobotState::SELECTING_DRILL_SITE: return "SELECTING_DRILL_SITE";
        case RobotState::DRILLING: return "DRILLING";
        case RobotState::EXTRACTING_MATERIAL: return "EXTRACTING_MATERIAL";
        case RobotState::PROCESSING_MATERIAL: return "PROCESSING_MATERIAL";
        case RobotState::DELIVERING_MATERIAL: return "DELIVERING_MATERIAL";
        case RobotState::RETURNING_TO_HUB: return "RETURNING_TO_HUB";
        case RobotState::UNLOADING_MATERIAL: return "UNLOADING_MATERIAL";
        case RobotState::REPAIRING_SELF: return "REPAIRING_SELF";
        case RobotState::EMERGENCY_ABORT: return "EMERGENCY_ABORT";
        case RobotState::HIBERNATION: return "HIBERNATION";
        case RobotState::WAITING_FOR_COMMAND: return "WAITING_FOR_COMMAND";
        default: return "UNKNOWN_STATE";
    }
}

class AutonomousMiningRobot {
public:
    AutonomousMiningRobot(const std::string& robot_id)
        : id_(robot_id), state_(RobotState::IDLE),
          current_position_({0.0, 0.0, 0.0}), current_velocity_({0.0, 0.0, 0.0}),
          current_orientation_({1.0, 0.0, 0.0, 0.0}),
          asteroid_orbital_params_({Constants::ASTEROID_REFERENCE_MASS, {1000.0, 0.0, 0.0}, {0.0, 0.0, 0.0}, {0.0, 0.0, 0.0}}),
          home_base_position_({0.0, 0.0, 0.0}),
          health_monitor_(robot_id) {
        std::cout << "\n--- Autonomous Mining Robot " << id_ << " Initialized. Ready for duty. Or coffee. Or both, ideally. ---\n";
        comms_.setBaseStationPosition(home_base_position_);
        // Set initial reliability (can degrade over time)
        imu_.setReliability(0.99);
        lidar_.setReliability(0.98);
        spectrometer_.setReliability(0.97);
        thrusters_.setReliability(0.95);
        arm_.setReliability(0.96);
        conveyor_.setReliability(0.95);
        refinery_.setReliability(0.94);
        power_unit_.setReliability(0.99);
        thermal_unit_.setReliability(0.98);
        vision_system_.setReliability(0.97);
        comms_.setReliability(0.90); // Comms can be more volatile
    }

    void runMissionCycle() {
        while (state_ != RobotState::EMERGENCY_ABORT && state_ != RobotState::IDLE && state_ != RobotState::HIBERNATION) {
            std::cout << "\n--- Robot " << id_ << " State: " << toString(state_) << " ---\n";
            updateRobotStatus(); // Always update status first
            
            // Check for external commands
            std::string command = comms_.receiveCommand();
            if (!command.empty()) {
                handleExternalCommand(command);
            }
            if (state_ == RobotState::WAITING_FOR_COMMAND) { // If command was received that causes this state
                 std::this_thread::sleep_for(std::chrono::milliseconds(500));
                 continue;
            }

            diagnoseCondition(); // Proactively check for problems
            achieveHomeostasis(); // Attempt self-correction/optimization

            // If a critical failure or self-repair transition occurred, re-check state
            if (state_ == RobotState::EMERGENCY_ABORT || state_ == RobotState::HIBERNATION || state_ == RobotState::REPAIRING_SELF) {
                if (state_ == RobotState::REPAIRING_SELF) {
                    executeSelfRepair(); // Execute repair within this iteration if needed
                }
                std::this_thread::sleep_for(std::chrono::milliseconds(200));
                continue; // Re-evaluate in next cycle
            }

            switch (state_) {
                case RobotState::PRE_FLIGHT_CHECK:
                    performPreFlightChecks();
                    break;
                case RobotState::NAVIGATING_TO_ASTEROID:
                    navigate(asteroid_orbital_params_.position, RobotState::APPROACHING_ASTEROID);
                    break;
                case RobotState::APPROACHING_ASTEROID:
                    approachAsteroid();
                    break;
                case RobotState::ATTACHING_TO_ASTEROID:
                    attachToAsteroid();
                    break;
                case RobotState::STABILIZING_ASTEROID:
                    stabilizeAsteroid();
                    break;
                case RobotState::SCANNING_SURFACE:
                    scanForExtractionSite();
                    break;
                case RobotState::SELECTING_DRILL_SITE:
                    selectDrillSite();
                    break;
                case RobotState::ANALYZING_MATERIAL:
                    analyzeMaterialAtSite();
                    break;
                case RobotState::DRILLING:
                    performDrilling();
                    break;
                case RobotState::EXTRACTING_MATERIAL:
                    extractMaterial();
                    break;
                case RobotState::PROCESSING_MATERIAL:
                    processExtractedMaterial();
                    break;
                case RobotState::DELIVERING_MATERIAL:
                    deliverMaterialToHub();
                    break;
                case RobotState::RETURNING_TO_HUB:
                    navigate(home_base_position_, RobotState::UNLOADING_MATERIAL);
                    break;
                case RobotState::UNLOADING_MATERIAL:
                    unloadAtHub();
                    break;
                case RobotState::IDLE:
                case RobotState::EMERGENCY_ABORT:
                case RobotState::HIBERNATION:
                case RobotState::WAITING_FOR_COMMAND:
                    break; // Should exit loop or wait
                case RobotState::REPAIRING_SELF: // Handled above, but included for completeness
                    // This case should ideally not be reached if handled by the `if` block.
                    break; 
            }
            std::this_thread::sleep_for(std::chrono::milliseconds(200)); // Simulate time passing for state machine steps
            reportTelemetry(); // Always report status
        }
        std::cout << "\n--- Robot " << id_ << " Mission Cycle Concluded. Time for a well-deserved (simulated) nap. Zzzzz...\n";
    }

    void startMission(const Vector3D& target_asteroid_pos, double asteroid_mass) {
        asteroid_orbital_params_.position = target_asteroid_pos;
        asteroid_orbital_params_.mass = asteroid_mass;
        setState(RobotState::PRE_FLIGHT_CHECK);
    }

    RobotState getState() const { return state_; }

    void setState(RobotState new_state) {
        std::cout << "[" << id_ << "] Transitioning from " << toString(state_)
                  << " to " << toString(new_state) << ".\n";
        state_ = new_state;
    }

private:
    std::string id_;
    RobotState state_;

    // Hardware Modules
    InertialMeasurementUnit imu_;
    LidarScanner lidar_;
    MaterialSpectrometer spectrometer_;
    ThrusterControl thrusters_;
    ManipulatorArm arm_;
    MaterialConveyor conveyor_;
    RefineryUnit refinery_;
    PowerManagementUnit power_unit_;
    ThermalManagementUnit thermal_unit_;
    VisionSystem vision_system_;
    CommunicationModule comms_;

    // System Management
    HealthMonitorSystem health_monitor_;

    // Robot & Mission State Data
    Vector3D current_position_;
    Vector3D current_velocity_;
    Quaternion current_orientation_; // Robot's orientation
    OrbitalParameters asteroid_orbital_params_;
    Vector3D home_base_position_;

    Vector3D current_drilling_site_ = {0.0, 0.0, 0.0};
    MaterialProperties current_extracted_material_properties_;
    int current_material_buffer_ = 0; // The actual buffer for the conveyor

    // --- Core System Management ---
    void updateRobotStatus() {
        // Update power and thermal status
        power_unit_.recharge(0.5); // Constant background recharge (e.g., solar panels)
        thermal_unit_.regulateTemperature(20.0, power_unit_.getCurrentDraw());

        // Report all component statuses to health monitor
        health_monitor_.reportComponentStatus("IMU", imu_.getLastError());
        health_monitor_.reportComponentStatus("LidarScanner", lidar_.getLastError());
        health_monitor_.reportComponentStatus("Spectrometer", spectrometer_.getLastError());
        health_monitor_.reportComponentStatus("Thrusters", thrusters_.getLastError(), static_cast<double>(thrusters_.getOperationalThrusterCount()) / 8.0);
        health_monitor_.reportComponentStatus("ManipulatorArm", arm_.getLastError(), arm_.getDrillWear());
        health_monitor_.reportComponentStatus("Conveyor", conveyor_.getLastError());
        health_monitor_.reportComponentStatus("Refinery", refinery_.getLastError());
        health_monitor_.reportComponentStatus("PowerManagementUnit", power_unit_.getLastError(), power_unit_.getChargeLevel() / 100.0);
        health_monitor_.reportComponentStatus("ThermalManagementUnit", thermal_unit_.getLastError(), thermal_unit_.getCurrentTemperature() / Constants::CRITICAL_TEMPERATURE);
        health_monitor_.reportComponentStatus("VisionSystem", vision_system_.getLastError());
        health_monitor_.reportComponentStatus("CommunicationModule", comms_.getLastError());
    }

    void diagnoseCondition() {
        if (!health_monitor_.isSystemHealthy()) {
            std::cout << "[" << id_ << "] DIAGNOSIS: System reports critical condition. Initiating detailed analysis.\n";
            for (const auto& error_pair : health_monitor_.getAllErrors()) {
                if (error_pair.second != ErrorCode::NONE) {
                    std::cout << "[" << id_ << "]   - Component " << error_pair.first << " reports error: " << toString(error_pair.second) << "\n";
                }
            }
            for (const auto& metric_pair : health_monitor_.getAllHealthMetrics()) {
                 if (metric_pair.first == "drill_wear" && metric_pair.second >= Constants::MAX_DRILL_WEAR) {
                     std::cout << "[" << id_ << "]   - Health Metric " << metric_pair.first << " is critical (" << metric_pair.second * 100 << "%).\n";
                 }
                 if (metric_pair.first == "thruster_count_ratio" && metric_pair.second < 0.5) {
                     std::cout << "[" << id_ << "]   - Health Metric " << metric_pair.first << " is critical (" << metric_pair.second * 100 << "% operational).\n";
                 }
                 if (metric_pair.first == "PowerManagementUnit" && metric_pair.second < 0.1) { // 10% charge
                     std::cout << "[" << id_ << "]   - Health Metric " << metric_pair.first << " is critically low (" << metric_pair.second * 100 << "% charge).\n";
                 }
                 if (metric_pair.first == "ThermalManagementUnit" && metric_pair.second > 1.0) { // Above critical temp
                     std::cout << "[" << id_ << "]   - Health Metric " << metric_pair.first << " is critically high (" << (metric_pair.second * Constants::CRITICAL_TEMPERATURE) << "C).\n";
                 }
            }
            // Transition to repair only if not already in repair/emergency.
            if (state_ != RobotState::REPAIRING_SELF && state_ != RobotState::EMERGENCY_ABORT) {
                setState(RobotState::REPAIRING_SELF); // Attempt to fix, or transition to abort
            }
        } else {
            std::cout << "[" << id_ << "] DIAGNOSIS: System operating within nominal parameters. Homeostasis maintained.\n";
        }
    }

    void achieveHomeostasis() {
        // This function represents the "impeccable logic" striving for eternal homeostasis.
        // It's a layer of proactive self-management, predictive maintenance, and adaptive control.

        // Only attempt to achieve homeostasis if not in a repair or emergency state,
        // to avoid conflicting actions.
        if (state_ == RobotState::REPAIRING_SELF || state_ == RobotState::EMERGENCY_ABORT || state_ == RobotState::HIBERNATION) {
            return;
        }

        // 1. Predictive Maintenance:
        if (arm_.getDrillWear() > Constants::MAX_DRILL_WEAR * 0.8) { // 80% worn
            std::cout << "[" << id_ << "] HOMEOSTASIS: Drill wear approaching critical levels (" << arm_.getDrillWear() * 100 << "%). Proposing maintenance soon.\n";
            // If at asteroid and not actively drilling/moving away, schedule replacement.
            if (state_ == RobotState::SCANNING_SURFACE || state_ == RobotState::SELECTING_DRILL_SITE || state_ == RobotState::ANALYZING_MATERIAL) {
                std::cout << "[" << id_ << "] HOMEOSTASIS: Scheduling drill bit replacement before next drilling operation.\n";
                setState(RobotState::REPAIRING_SELF); // Force repair state
                return; // Exit to execute repair
            }
        }
        if (power_unit_.getChargeLevel() < 20.0) { // 20% charge
            std::cout << "[" << id_ << "] HOMEOSTASIS: Power level critically low (" << power_unit_.getChargeLevel() << "%). Prioritizing recharge or hibernation.\n";
            if (state_ == RobotState::NAVIGATING_TO_ASTEROID || state_ == RobotState::RETURNING_TO_HUB) {
                // If far from base, prioritize reaching safety or hibernation.
                if (power_unit_.getChargeLevel() < 5.0) { // Truly critical
                    setState(RobotState::HIBERNATION); // Enter hibernation to conserve power
                    return; // Exit to execute hibernation
                }
            } else { // If stationary or near resources, try to recharge aggressively
                power_unit_.recharge(5.0); // Attempt to boost recharge
                std::this_thread::sleep_for(std::chrono::milliseconds(500)); // Simulate time for recharge
            }
        }
        if (thermal_unit_.getCurrentTemperature() > Constants::CRITICAL_TEMPERATURE * 0.9) { // 90% of critical temp
            std::cout << "[" << id_ << "] HOMEOSTASIS: Temperature high (" << thermal_unit_.getCurrentTemperature() << "C). Reducing power draw for non-critical systems.\n";
            // Reduce power for non-essential systems (e.g., reduce scan resolution, slow down comms)
            power_unit_.releasePower(100.0); // Example: release 100W
        }

        // 2. Adaptive Control (example for navigation based on thruster health):
        if (state_ == RobotState::NAVIGATING_TO_ASTEROID || state_ == RobotState::APPROACHING_ASTEROID) {
            if (thrusters_.getOperationalThrusterCount() < 4 && thrusters_.getOperationalThrusterCount() > 0) { // If less than half
                std::cout << "[" << id_ << "] HOMEOSTASIS: Thruster degradation detected. Adjusting navigation parameters for reduced thrust capability.\n";
                // In a real system, this would involve re-calculating delta-V requirements, extending travel time, etc.
                // For simulation, we acknowledge it and assume the `navigate` function is adaptively slower.
            } else if (thrusters_.getOperationalThrusterCount() == 0) {
                 std::cout << "[" << id_ << "] HOMEOSTASIS: Thrusters critically damaged. Initiating emergency abort to nearest safe haven.\n";
                 setState(RobotState::EMERGENCY_ABORT);
                 return; // Exit to execute abort
            }
        }

        // 3. Environmental Adaptation (Asteroid Instability):
        if (asteroid_orbital_params_.angular_velocity.magnitude() > Constants::ASTEROID_ROTATION_STABILITY_THRESHOLD * 2) {
             std::cout << "[" << id_ << "] HOMEOSTASIS: Asteroid highly unstable. Prioritizing stabilization over mining operations.\n";
             if (arm_.isAttached()) {
                 setState(RobotState::STABILIZING_ASTEROID);
                 return; // Exit to execute stabilization
             } else {
                 std::cout << "[" << id_ << "] HOMEOSTASIS: Cannot stabilize without attachment. Retreating to safe distance.\n";
                 setState(RobotState::EMERGENCY_ABORT); // If too risky, abort
                 return; // Exit to execute abort
             }
        }
        
        // 4. Mission Recalibration for long-term efficiency and 'wisdom' (opposite of vanity)
        // If a site yields low-value material, the system should learn.
        if (state_ == RobotState::PROCESSING_MATERIAL && current_extracted_material_properties_.value_per_unit < 20.0) { // Arbitrary low value threshold
            std::cout << "[" << id_ << "] HOMEOSTASIS (Wisdom): Current material yield is low-value. Re-prioritizing scan for higher-value resources for future extractions.\n";
            // This is where a more advanced AI would update its resource maps or search heuristics.
            // For now, it's a log message indicating this 'thought' process. After current batch, next state is scanning.
            // No state change here, just a strategic note.
        }

        // This level of logic aims not just to fix immediate problems, but to prevent them,
        // optimize for endurance, and make decisions that ensure the "eternal homeostasis" of the mission.
    }

    void executeSelfRepair() {
        std::cout << "[" << id_ << "] Entering self-repair protocol. Prioritizing critical systems based on diagnostics.\n";
        ErrorCode overall_error = health_monitor_.getOverallSystemError();
        bool repaired_anything = false;

        if (overall_error == ErrorCode::DRILL_WEAR_CRITICAL || arm_.getDrillWear() >= Constants::MAX_DRILL_WEAR * 0.8) {
            arm_.replaceDrillBit();
            health_monitor_.reportComponentStatus("ManipulatorArm", ErrorCode::NONE, 0.0); // Reset wear
            repaired_anything = true;
        }
        if (overall_error == ErrorCode::POWER_CRITICAL || power_unit_.getChargeLevel() < 10.0) {
            std::cout << "[" << id_ << "] Attempting emergency power redirection and extended recharge.\n";
            power_unit_.recharge(10.0); // Aggressive recharge
            std::this_thread::sleep_for(std::chrono::milliseconds(1000));
            if (power_unit_.getChargeLevel() < 10.0) { // Still low after attempt
                std::cout << "[" << id_ << "] CRITICAL: Power repair failed to restore sufficient charge. Cannot proceed.\n";
                setState(RobotState::EMERGENCY_ABORT);
                return;
            }
            health_monitor_.reportComponentStatus("PowerManagementUnit", ErrorCode::NONE, power_unit_.getChargeLevel() / 100.0);
            repaired_anything = true;
        }
        if (overall_error == ErrorCode::ACTUATOR_FAILURE || thrusters_.getOperationalThrusterCount() < 8) {
            for (int i = 0; i < 8; ++i) {
                if (!thrusters_.thruster_health_[i]) { // Accessing protected member for demo
                    thrusters_.repairThruster(i);
                    repaired_anything = true;
                }
            }
            health_monitor_.reportComponentStatus("Thrusters", ErrorCode::NONE, static_cast<double>(thrusters_.getOperationalThrusterCount()) / 8.0);
        }
        // General sensor repairs (calibration)
        if (imu_.getLastError() != ErrorCode::NONE && imu_.isActive()) { imu_.calibrate(); repaired_anything = true; }
        if (lidar_.getLastError() != ErrorCode::NONE && lidar_.isActive()) { lidar_.activate(); repaired_anything = true; } // Simulate re-initialization
        
        // After repair attempts, check if healthy, then resume mission
        if (health_monitor_.isSystemHealthy() && repaired_anything) {
            std::cout << "[" << id_ << "] Self-repair successful. Resuming previous mission state.\n";
            // A more sophisticated system would remember its prior state before repair
            // For now, let's assume it was coming from a mining-related task.
            setState(RobotState::SCANNING_SURFACE); // A safe state to re-evaluate
        } else if (!repaired_anything && !health_monitor_.isSystemHealthy()) {
            std::cout << "[" << id_ << "] Self-repair attempted but nothing changed or no repair actions could be taken. Remaining in emergency state.\n";
            setState(RobotState::EMERGENCY_ABORT); // If no repairs could be made and still unhealthy
        } else { // Either healthy already or unable to repair, and nothing was "repaired"
            std::cout << "[" << id_ << "] Self-repair protocol finished. System is now healthy or no further repairs were needed.\n";
            // If it was already healthy but entered this state due to a predictive trigger, go back to previous state.
            // For simplicity, let's also return to scanning.
            setState(RobotState::SCANNING_SURFACE);
        }
    }

    void reportTelemetry() {
        std::string telemetry_data = "POS:(" + std::to_string(current_position_.x) + "," + std::to_string(current_position_.y) + "," + std::to_string(current_position_.z) + ")"
                                     + "|VEL:(" + std::to_string(current_velocity_.x) + "," + std::to_string(current_velocity_.y) + "," + std::to_string(current_velocity_.z) + ")"
                                     + "|STATE:" + toString(state_)
                                     + "|CHARGE:" + std::to_string(power_unit_.getChargeLevel()) + "%"
                                     + "|TEMP:" + std::to_string(thermal_unit_.getCurrentTemperature()) + "C"
                                     + "|BUFF:" + std::to_string(current_material_buffer_) + "/" + std::to_string(Constants::MATERIAL_BUFFER_CAPACITY)
                                     + "|ERR:" + toString(health_monitor_.getOverallSystemError());
        comms_.sendTelemetry(telemetry_data, current_position_);
    }

    void handleExternalCommand(const std::string& command) {
        std::cout << "[" << id_ << "] Executing external command: " << command << "\n";
        if (command == "RECALIBRATE_IMU") {
            imu_.calibrate();
        } else if (command == "RETRIEVE_ABORT") {
            setState(RobotState::EMERGENCY_ABORT);
        } else if (command == "OPTIMIZE_DRILL_RPM") {
            // Placeholder for an actual optimization
            std::cout << "[" << id_ << "] Drill RPM optimized for current material properties.\n";
        } else if (command == "REPORT_STATUS") {
            reportTelemetry(); // Force immediate telemetry
        } else {
            std::cout << "[" << id_ << "] Unknown command: " << command << ". Ignoring.\n";
        }
        setState(RobotState::WAITING_FOR_COMMAND); // Return to wait state after command processing
    }

    // --- State-specific logic (Enhanced) ---
    void performPreFlightChecks() {
        std::cout << "[" << id_ << "] Performing comprehensive pre-flight diagnostics. Trust, but verify.\n";
        imu_.calibrate();
        lidar_.activate();
        spectrometer_.activate();
        vision_system_.activate();
        comms_.activate();
        thrusters_.activate();
        arm_.activate();
        conveyor_.activate();
        refinery_.activate();
        power_unit_.activate();
        thermal_unit_.activate();

        // Check power, thermal, comms etc.
        if (!power_unit_.requestPower(50.0)) { // Minimum power for checks
            std::cout << "[" << id_ << "] Pre-flight check failed: Power anomaly.\n";
            setState(RobotState::EMERGENCY_ABORT);
            return;
        }
        power_unit_.releasePower(50.0);

        if (!comms_.sendTelemetry("Pre-flight OK", current_position_)) {
            std::cout << "[" << id_ << "] Pre-flight check failed: Communications anomaly.\n";
            setState(RobotState::EMERGENCY_ABORT);
            return;
        }
        if (!health_monitor_.isSystemHealthy()) {
            std::cout << "[" << id_ << "] Pre-flight check failed: Component errors detected. Entering repair.\n";
            setState(RobotState::REPAIRING_SELF);
            return;
        }
        std::cout << "[" << id_ << "] All pre-flight systems nominal. Engage!\n";
        setState(RobotState::NAVIGATING_TO_ASTEROID);
    }

    Vector3D calculateGravitationalForce(const Vector3D& target_pos, double target_mass) const {
        Vector3D relative_position = target_pos - current_position_;
        double distance = relative_position.magnitude();
        // Bulletproof: handle extremely close distances
        if (distance < 1.0) distance = 1.0; // Prevent runaway forces at very short distances

        double force_magnitude = (Constants::GRAVITATIONAL_CONSTANT * target_mass * Constants::ROBOT_MASS) / (distance * distance);
        Vector3D force_direction = relative_position.normalized();
        return force_direction * force_magnitude;
    }

    void navigate(const Vector3D& target_position, RobotState next_state_on_arrival) {
        std::cout << "[" << id_ << "] Navigating to target coordinates ("
                  << target_position.x << ", " << target_position.y << ", " << target_position.z << "). Calculating optimal trajectory, which is usually 'straight at it'.\n";

        Vector3D navigation_vector = target_position - current_position_;
        double distance_to_target = navigation_vector.magnitude();

        if (distance_to_target < Constants::NAVIGATION_TARGET_DISTANCE_TOLERANCE) { // Close enough
            std::cout << "[" << id_ << "] Arrived at target zone. Nailed it.\n";
            current_position_ = target_position; // Snap to target for precision
            current_velocity_ = {0.0, 0.0, 0.0}; // Stop
            setState(next_state_on_arrival);
            return;
        }

        // Advanced Navigation: PID-like control or simple proportional control
        Vector3D desired_direction = navigation_vector.normalized();
        // Proportional control for speed: reduce speed as we get closer
        double approach_factor = std::min(1.0, distance_to_target / Constants::NAVIGATION_APPROACH_DISTANCE); 
        double thrust_magnitude = Constants::THRUST_MAGNITUDE_NAV * approach_factor;

        if (!power_unit_.requestPower(thrust_magnitude / 10.0)) { // Power proportional to thrust
            setState(RobotState::REPAIRING_SELF); // Go to repair if no power
            return;
        }
        thrusters_.applyThrust(desired_direction, thrust_magnitude);
        power_unit_.releasePower(thrust_magnitude / 10.0);

        // Incorporate gravitational influence from known bodies
        Vector3D gravitational_force = {0.0, 0.0, 0.0};
        if (next_state_on_arrival == RobotState::APPROACHING_ASTEROID || next_state_on_arrival == RobotState::ATTACHING_TO_ASTEROID) {
            gravitational_force = calculateGravitationalForce(asteroid_orbital_params_.position, asteroid_orbital_params_.mass);
        }
        // In a more complete system, all major celestial bodies would be accounted for.

        // Update position and velocity using basic Euler integration with a small dt
        double dt = 0.1; // Small time step for smoother simulation
        Vector3D net_force = (desired_direction * thrust_magnitude) + gravitational_force;
        Vector3D acceleration = net_force / Constants::ROBOT_MASS;
        
        current_velocity_ = current_velocity_ + acceleration * dt;
        current_position_ = current_position_ + current_velocity_ * dt;
        current_orientation_ = imu_.getOrientation(); // Update orientation from IMU

        std::cout << "[" << id_ << "] Current Pos: (" << std::fixed << std::setprecision(2) << current_position_.x << ", " << current_position_.y << ", " << current_position_.z
                  << "), Vel: (" << current_velocity_.x << ", " << current_velocity_.y << ", " << current_velocity_.z
                  << "), Dist: " << std::fixed << std::setprecision(2) << distance_to_target << "m.\n";
        std::this_thread::sleep_for(std::chrono::milliseconds(100)); // Simulate finer-grained flight time
    }

    void approachAsteroid() {
        std::cout << "[" << id_ << "] Approaching asteroid, engaging fine navigation and hazard avoidance systems.\n";
        double distance_to_target = (asteroid_orbital_params_.position - current_position_).magnitude();

        if (distance_to_target < Constants::NAVIGATION_APPROACH_DISTANCE) {
            std::cout << "[" << id_ << "] Within approach distance. Preparing for attachment.\n";
            setState(RobotState::ATTACHING_TO_ASTEROID);
            return;
        }

        // Perform obstacle avoidance using Lidar and Vision
        std::vector<Vector3D> lidar_scan = lidar_.scanEnvironment(current_position_, current_orientation_);
        // Simple collision detection: if any point is too close, apply avoidance thrust
        for (const auto& point : lidar_scan) {
            if ((point - current_position_).magnitude() < 5.0) { // Arbitrary close distance
                Vector3D avoidance_direction = (current_position_ - point).normalized(); // Push away from obstacle
                if (!power_unit_.requestPower(Constants::THRUST_MAGNITUDE_NAV / 5.0)) { setState(RobotState::REPAIRING_SELF); return; }
                thrusters_.applyThrust(avoidance_direction, Constants::THRUST_MAGNITUDE_NAV / 5.0);
                power_unit_.releasePower(Constants::THRUST_MAGNITUDE_NAV / 5.0);
                std::cout << "[" << id_ << "] WARNING: Obstacle detected, performing avoidance maneuver.\n";
                // This would ideally integrate into the navigation function, not override.
                std::this_thread::sleep_for(std::chrono::milliseconds(200));
            }
        }
        navigate(asteroid_orbital_params_.position, RobotState::APPROACHING_ASTEROID); // Continue navigating but with avoidance
    }

    void attachToAsteroid() {
        std::cout << "[" << id_ << "] Deploying anchoring clamps and engaging magnetic grapples. A firm handshake with a giant space rock.\n";
        std::vector<Vector3D> lidar_scan = lidar_.scanEnvironment(current_position_, current_orientation_);
        std::vector<Vector3D> attachment_points = vision_system_.identifyAttachmentPoints(lidar_scan);

        if (attachment_points.empty()) {
            std::cout << "[" << id_ << "] CRITICAL: No suitable attachment points found. Retreating to rescan.\n";
            setState(RobotState::APPROACHING_ASTEROID); // Go back to approach to find a new spot
            return;
        }

        // Target the first suitable point for attachment
        Vector3D target_attach_point = attachment_points[0];
        // Fine-tune position to target_attach_point
        navigate(target_attach_point, RobotState::STABILIZING_ASTEROID); // Navigate directly to attachment point

        // If arrived at attachment point
        if ((current_position_ - target_attach_point).magnitude() < Constants::NAVIGATION_TARGET_DISTANCE_TOLERANCE) {
            if (!power_unit_.requestPower(100.0)) { setState(RobotState::REPAIRING_SELF); return; }
            if (!arm_.extend() || !arm_.grab("asteroid surface")) {
                std::cout << "[" << id_ << "] CRITICAL: Attachment failed! Retracting arm and attempting again.\n";
                arm_.release(); arm_.retract(); // Ensure arm is clear
                power_unit_.releasePower(100.0);
                setState(RobotState::APPROACHING_ASTEROID); // Try finding new attachment points
                return;
            }
            power_unit_.releasePower(100.0);
            std::this_thread::sleep_for(std::chrono::seconds(2));
            std::cout << "[" << id_ << "] Successfully attached to the asteroid. We're not going anywhere, unless we want to, which we do.\n";
            setState(RobotState::STABILIZING_ASTEROID);
        }
    }

    void stabilizeAsteroid() {
        std::cout << "[" << id_ << "] Monitoring and stabilizing asteroid's rotational dynamics. Precision is key here.\n";
        Vector3D current_angular_velocity = imu_.getAngularVelocity();
        asteroid_orbital_params_.angular_velocity = current_angular_velocity; // Update internal model

        if (current_angular_velocity.magnitude() > Constants::ASTEROID_ROTATION_STABILITY_THRESHOLD) {
            std::cout << "[" << id_ << "] Asteroid rotation detected! Initiating counter-thrusts. Let's make this rock sit still.\n";
            if (!power_unit_.requestPower(Constants::THRUST_MAGNITUDE_STAB / 5.0)) { setState(RobotState::REPAIRING_SELF); return; }
            thrusters_.stabilizeRotation(current_angular_velocity);
            power_unit_.releasePower(Constants::THRUST_MAGNITUDE_STAB / 5.0);
            // In a real system, this would iteratively reduce angular velocity over several cycles.
            std::this_thread::sleep_for(std::chrono::milliseconds(1000));
        } else {
            std::cout << "[" << id_ << "] Asteroid rotational stability nominal. Proceed with operations. Smooth sailing, or rather, smooth orbiting.\n";
            setState(RobotState::SCANNING_SURFACE);
        }
    }

    void scanForExtractionSite() {
        std::cout << "[" << id_ << "] Scanning surface for optimal extraction sites. Looking for that sweet spot of resources and structural integrity.\n";
        std::vector<Vector3D> scan_data = lidar_.scanEnvironment(current_position_, current_orientation_);
        
        if (scan_data.empty()) {
            std::cout << "[" << id_ << "] No scan data received. Lidar failure or environment too featureless? Retrying scan.\n";
            std::this_thread::sleep_for(std::chrono::seconds(1));
            return; // Stay in scanning state
        }
        // In a real scenario, analyze scan_data for suitable drilling locations (flatness, material proximity)
        // For simulation, we just pick candidates and move to selection.
        std::vector<Vector3D> potential_sites;
        for(const auto& p : scan_data) {
            // Further refinement: check if the point is within reachable arm distance and has a reasonable orientation
            // For now, simplify to just structural integrity
            if (lidar_.assessStructuralIntegrity(p) > Constants::ASTEROID_STRUCTURAL_INTEGRITY_THRESHOLD) {
                potential_sites.push_back(p);
            }
        }

        if (potential_sites.empty()) {
            std::cout << "[" << id_ << "] No suitable drilling sites with adequate structural integrity found. This asteroid is surprisingly boring. Trying again.\n";
            last_error_ = ErrorCode::NO_SUITABLE_SITE;
            std::this_thread::sleep_for(std::chrono::seconds(1));
            return; // Stay in scanning state
        }
        current_drilling_site_ = potential_sites[std::rand() % potential_sites.size()]; // Pick one for now
        setState(RobotState::SELECTING_DRILL_SITE);
    }

    void selectDrillSite() {
        std::cout << "[" << id_ << "] Evaluating potential drill sites based on scan data, material analysis predictions, and structural integrity.\n";
        // This is where a more advanced AI/ML model would crunch data from lidar, vision, spectrometer
        // to determine the optimal site. For now, we use the randomly chosen one from scanForExtractionSite.
        double structural_integrity = lidar_.assessStructuralIntegrity(current_drilling_site_);
        if (structural_integrity < Constants::ASTEROID_STRUCTURAL_INTEGRITY_THRESHOLD) {
            std::cout << "[" << id_ << "] Drill site at (" << current_drilling_site_.x << ", " << current_drilling_site_.y << ", " << current_drilling_site_.z
                      << ") has insufficient structural integrity (" << structural_integrity * 100 << "%). Re-scanning.\n";
            last_error_ = ErrorCode::STRUCTURAL_INTEGRITY_COMPROMISED;
            setState(RobotState::SCANNING_SURFACE); // Go back and find a better one
            return;
        }
        std::cout << "[" << id_ << "] Identified optimal drilling site at ("
                  << current_drilling_site_.x << ", " << current_drilling_site_.y << ", " << current_drilling_site_.z << ") with "
                  << std::fixed << std::setprecision(2) << structural_integrity * 100 << "% structural integrity. Looks promising.\n";
        setState(RobotState::ANALYZING_MATERIAL);
    }

    void analyzeMaterialAtSite() {
        std::cout << "[" << id_ << "] Deploying spectrometer to analyze material at proposed site. Because guessing is for amateurs.\n";
        current_extracted_material_properties_ = spectrometer_.analyzeMaterial(current_drilling_site_);
        
        if (current_extracted_material_properties_.type == "Failed Scan" || current_extracted_material_properties_.type == "Unknown Anomaly") {
            std::cout << "[" << id_ << "] CRITICAL: Material analysis failed or identified unknown anomaly. Unable to proceed with drilling. Re-scanning.\n";
            last_error_ = ErrorCode::UNKNOWN_ERROR; // More specific error could be MATERIAL_ANALYSIS_UNCERTAIN
            setState(RobotState::SCANNING_SURFACE);
            return;
        }

        std::cout << "[" << id_ << "] Analysis complete: Detected primarily " << current_extracted_material_properties_.type
                  << " at this site. Density: " << current_extracted_material_properties_.density << ", Hardness: " << current_extracted_material_properties_.hardness
                  << ". Excellent choice, robot!\n";
        setState(RobotState::DRILLING);
    }

    void performDrilling() {
        std::cout << "[" << id_ << "] Initiating drilling operations. Making holes, making history, and hopefully making money (or post-scarcity credits).\n";
        if (arm_.getDrillWear() >= Constants::MAX_DRILL_WEAR) {
            std::cout << "[" << id_ << "] CRITICAL: Drill bit worn out before drilling. Initiating self-repair.\n";
            setState(RobotState::REPAIRING_SELF);
            return;
        }
        
        if (!power_unit_.requestPower(200.0)) { // High power for drilling
            setState(RobotState::REPAIRING_SELF);
            return;
        }
        if (!arm_.drillAt(current_drilling_site_, Constants::EXTRACTION_DEPTH_TARGET, current_extracted_material_properties_)) {
            std::cout << "[" << id_ << "] CRITICAL: Drilling failed! Analyzing cause (e.g., hard rock, drill bit failure).\n";
            power_unit_.releasePower(200.0);
            setState(RobotState::REPAIRING_SELF); // Attempt to fix drill or retry
            return;
        }
        power_unit_.releasePower(200.0);
        std::cout << "[" << id_ << "] Drilling to target depth (" << Constants::EXTRACTION_DEPTH_TARGET << "m) complete. That's a big hole.\n";
        setState(RobotState::EXTRACTING_MATERIAL);
    }

    void extractMaterial() {
        std::cout << "[" << id_ << "] Activating extraction mechanisms and conveyor for " << current_extracted_material_properties_.type << ". Let the cosmic bounty flow!\n";
        if (!power_unit_.requestPower(50.0)) { setState(RobotState::REPAIRING_SELF); return; }
        conveyor_.activate();
        
        int extracted_total = 0;
        // The condition allows for over-extraction attempts which will be capped by loadMaterial.
        // The loop will exit if the buffer is truly full or a conveyor error occurs.
        while (!conveyor_.isFull(current_material_buffer_) && extracted_total < Constants::MATERIAL_BUFFER_CAPACITY * 2) { 
            // Simulate extraction rate based on material properties (e.g., density, cohesion)
            int chunk_size = static_cast<int>(50.0 / current_extracted_material_properties_.density * 1000.0); // Denser material = less per chunk
            if (chunk_size < 1) chunk_size = 1; // Ensure at least 1 unit is attempted
            
            if (!conveyor_.loadMaterial(current_extracted_material_properties_.type, chunk_size, current_material_buffer_)) {
                std::cout << "[" << id_ << "] Extraction interrupted: Conveyor failure or buffer full. Attempting to resolve.\n";
                last_error_ = conveyor_.getLastError(); // Capture specific conveyor error
                break; // Exit loop on failure
            }
            extracted_total += chunk_size;
            std::this_thread::sleep_for(std::chrono::milliseconds(100));
        }
        conveyor_.deactivate();
        power_unit_.releasePower(50.0);
        std::cout << "[" << id_ << "] Extraction complete. Conveyor buffer at " << current_material_buffer_ << "/" << Constants::MATERIAL_BUFFER_CAPACITY
                  << ". Time to process.\n";
        if (conveyor_.isFull(current_material_buffer_)) {
            setState(RobotState::PROCESSING_MATERIAL);
        } else if (conveyor_.getLastError() != ErrorCode::NONE) {
            setState(RobotState::REPAIRING_SELF); // Conveyor issue
        } else { // Not full, no conveyor error, implies site depleted or low yield
            std::cout << "[" << id_ << "] Extraction site potentially depleted or not enough material to fill buffer. Returning to scanning.\n";
            last_error_ = ErrorCode::RESOURCE_DEPLETION;
            setState(RobotState::SCANNING_SURFACE); // Go back to find more if not full
        }
    }

    void processExtractedMaterial() {
        if (current_material_buffer_ == 0) {
            std::cout << "[" << id_ << "] No material in buffer to process. Skipping processing.\n";
            setState(RobotState::SCANNING_SURFACE); // Go find more
            return;
        }

        if (!power_unit_.requestPower(300.0)) { setState(RobotState::REPAIRING_SELF); return; } // High power for refining
        current_extracted_material_properties_ = refinery_.processMaterial(current_extracted_material_properties_, current_material_buffer_);
        power_unit_.releasePower(300.0);

        if (refinery_.getLastError() != ErrorCode::NONE || current_extracted_material_properties_.type == "Failed Processing") {
            std::cout << "[" << id_ << "] CRITICAL: Material processing failed! Attempting self-repair or re-evaluation.\n";
            last_error_ = refinery_.getLastError();
            setState(RobotState::REPAIRING_SELF);
            return;
        }
        std::cout << "[" << id_ << "] Material refined. Ready for transport to orbital manufacturing hub. One step closer to self-replicating robots!\n";
        setState(RobotState::DELIVERING_MATERIAL);
    }

    void deliverMaterialToHub() {
        std::cout << "[" << id_ << "] Detaching from asteroid and preparing to deliver material to orbital hub. Smooth disengagement initiated.\n";
        if (!power_unit_.requestPower(50.0)) { setState(RobotState::REPAIRING_SELF); return; }
        if (!arm_.release() || !arm_.retract()) {
            std::cout << "[" << id_ << "] CRITICAL: Detachment failed! Arm anomaly. Entering repair state.\n";
            last_error_ = arm_.getLastError();
            power_unit_.releasePower(50.0);
            setState(RobotState::REPAIRING_SELF);
            return;
        }
        power_unit_.releasePower(50.0);
        std::this_thread::sleep_for(std::chrono::seconds(1));
        std::cout << "[" << id_ << "] Detachment complete. Heading home.\n";
        setState(RobotState::RETURNING_TO_HUB);
    }

    void unloadAtHub() {
        std::cout << "[" << id_ << "] Arrived at orbital hub. Initiating material transfer. The moment of truth for our cargo.\n";
        if (!power_unit_.requestPower(20.0)) { setState(RobotState::REPAIRING_SELF); return; }
        if (!conveyor_.isEmpty(current_material_buffer_)) {
            int quantity = conveyor_.unloadMaterial(current_material_buffer_);
            if (conveyor_.getLastError() != ErrorCode::NONE) {
                std::cout << "[" << id_ << "] CRITICAL: Unloading failed! Conveyor anomaly. Initiating repair.\n";
                last_error_ = conveyor_.getLastError();
                power_unit_.releasePower(20.0);
                setState(RobotState::REPAIRING_SELF);
                return;
            }
            std::cout << "[" << id_ << "] Successfully transferred " << quantity << " units to the hub. Mission accomplished, and the inventory count looks good!\n";
        } else {
            std::cout << "[" << id_ << "] Nothing to unload. Did we just come for the view? (Self-correction needed).\n";
        }
        power_unit_.releasePower(20.0);
        setState(RobotState::IDLE); // Mission complete, await new orders.
    }
};

} // namespace AREOMH

// Main function for demonstration purposes
int main() {
    std::srand(static_cast<unsigned int>(std::time(nullptr))); // Seed random for simulations
    AREOMH::AutonomousMiningRobot robot1("Pioneer-7");

    std::cout << "\nStarting mission for Pioneer-7 to asteroid 'Iron Giant' at (1000, 0, 0) with 1e12 kg mass.\n";
    robot1.startMission({1000.0, 0.0, 0.0}, AREOMH::Constants::ASTEROID_REFERENCE_MASS);
    robot1.runMissionCycle();

    std::cout << "\nSimulation ended. The future is bright, and full of processed asteroid-derived resources.\n";

    // Demonstrate a second mission cycle or specific state
    AREOMH::AutonomousMiningRobot robot2("Voyager-11");
    std::cout << "\nStarting a second mission for Voyager-11, simulating a tougher asteroid and potential failures.\n";
    robot2.imu_.setReliability(0.7); // Simulate degraded IMU
    robot2.arm_.setReliability(0.6); // Simulate degraded arm
    robot2.startMission({1500.0, 500.0, 200.0}, AREOMH::Constants::ASTEROID_REFERENCE_MASS * 1.5);
    robot2.runMissionCycle();

    return 0;
}
```