// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract HealthRecordManagement {
    address private owner;

    struct HealthRecord {
        uint256 recordId;
        address patientAddress;
        string diagnosis;
        string treatment;
        uint256 timeStamp;
        address addedBy;
    }

    struct Prescription {
        uint256 prescriptionId;
        address patientAddress;
        string medication;
        string dosage;
        uint256 timeStamp;
        address issuedBy;
    }

    struct EmergencyContact {
        string name;
        string phone;
        string relationship;
    }

    // Mappings
    mapping(address => bool) private authorizedHealthServiceProviders; // Tracks authorized healthcare provider Address - bool
    mapping(address => address[]) private patientToDoctors; // Maps a patient to a list of doctors
    mapping(address => address[]) private doctorToPatients; // Maps a doctor to a list of patients
    mapping(address => HealthRecord[]) private patientHealthRecords; // patientAddress - array of healthRecords
    mapping(address => Prescription[]) private patientPrescriptions; // patientAddress - array of prescriptions
    mapping(address => EmergencyContact) private patientEmergencyContacts; // patientAddress - emergency contact

    // Events
    event RegisterAuthorizedHealthServiceProvider(address indexed healthServiceProviderAddress, bool registerStatus, address indexed updateBy, uint256 timeStamp);
    event DeRegisterAuthorizedHealthServiceProvider(address indexed healthServiceProviderAddress, bool deRegisterStatus, address indexed updateBy, uint256 timeStamp);
    event TransferFeesAndBookAppointment(address indexed fromPatientAddress, address indexed toHealthServiceProviderAddress, uint256 fees, uint256 timeStamp);
    event AddHealthRecord(uint256 recordId, address indexed patientAddress, address indexed addedBy, uint256 timeStamp);
    event IssuePrescription(uint256 prescriptionId, address indexed patientAddress, address indexed issuedBy, uint256 timeStamp);
    event UpdateEmergencyContact(address indexed patientAddress, string name, string phone, string relationship, uint256 timeStamp);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }
    modifier onlyAuthorizedHealthServiceProvider() {
        require(authorizedHealthServiceProviders[msg.sender], "Only authorized health service provider can perform this action");
        _;
    }
    modifier canAddHealthRecord(address patientAddress) {
        require(
            msg.sender == patientAddress || isDoctorOfPatient(msg.sender, patientAddress),
            "Only the patient or their appointed doctor can add a health record."
        );
        _;
    }
    modifier canViewHealthRecord(address patientAddress) {
        require(
            msg.sender == patientAddress || isDoctorOfPatient(msg.sender, patientAddress),
            "Access restricted to the patient or their appointed doctor only"
        );
        _;
    }

    // Helper function to check if a doctor is associated with a patient
    function isDoctorOfPatient(address doctorAddress, address patientAddress) internal view returns (bool) {
        address[] memory doctors = patientToDoctors[patientAddress];
        for (uint256 i = 0; i < doctors.length; i++) {
            if (doctors[i] == doctorAddress) {
                return true;
            }
        }
        return false;
    }

    constructor() {
        owner = msg.sender; // 'msg.sender' is sender of current call, contract deployer for a constructor
        console.log("Decentralized Health Record Management contract deployed by:", msg.sender);
    }

    // Check if the given address is the contract owner
    function isOwner(address user) public view returns (bool) {
        return user == owner;
    }

    // Check if the address is an authorized health service provider
    function isHealthServiceProvider(address user) public view returns (bool) {
        return authorizedHealthServiceProviders[user];
    }

    // A normal user is neither owner nor health service provider
    function isNormalUser(address user) public view returns (bool) {
        return user != owner && !authorizedHealthServiceProviders[user];
    }

    // Register an authorized healthcare service provider
    function registerHealthCareServiceProvider(address _healthServiceProvider) public onlyOwner {
        require(_healthServiceProvider != address(0), "Invalid address: address cannot be null");
        require(!authorizedHealthServiceProviders[_healthServiceProvider], "Health Service Provider is already registered");

        authorizedHealthServiceProviders[_healthServiceProvider] = true;
        console.log("%s registered successfully as an authorized HealthCare Service Provider", _healthServiceProvider);
        emit RegisterAuthorizedHealthServiceProvider(_healthServiceProvider, true, owner, block.timestamp);
    }

    // Deregister a healthcare service provider
    function deregisterHealthCareServiceProvider(address _healthServiceProvider) public onlyOwner {
        require(_healthServiceProvider != address(0), "Invalid address: address cannot be null");
        require(authorizedHealthServiceProviders[_healthServiceProvider], "Health Service Provider is not currently registered");

        authorizedHealthServiceProviders[_healthServiceProvider] = false;
        console.log("%s deregistered successfully", _healthServiceProvider);
        emit DeRegisterAuthorizedHealthServiceProvider(_healthServiceProvider, false, owner, block.timestamp);
    }

    // Patient sets an appointment with a doctor by fees
    function setAppointment(address doctorAddress) public payable {
        require(doctorAddress != address(0), "Invalid doctor address");
        require(authorizedHealthServiceProviders[doctorAddress], "Doctor is not an authorized healthcare provider");
        require(msg.value > 0, "Appointment fee must be greater than zero");

        // Transfer fee directly to the doctor
        payable(doctorAddress).transfer(msg.value);

        // Update relationships
        patientToDoctors[msg.sender].push(doctorAddress);
        doctorToPatients[doctorAddress].push(msg.sender);

        emit TransferFeesAndBookAppointment(msg.sender, doctorAddress, msg.value, block.timestamp);
    }

    // Get a patient's doctors
    function getDoctorListByPatientAddress(address patientAddress) public view returns (address[] memory) {
        require(msg.sender == patientAddress, "Only the patient can view their doctors");
        return patientToDoctors[patientAddress];
    }

    // Get a doctor's patients
    function getPatientListByDoctorAddress(address doctorAddress) public view returns (address[] memory) {
        require(authorizedHealthServiceProviders[doctorAddress], "Only authorized healthcare service providers can have patients");
        return doctorToPatients[doctorAddress];
    }

    // Add health record
    function addHealthRecord(
        address patientAddress,
        string memory diagnosis,
        string memory treatment
    ) public canAddHealthRecord(patientAddress) {
        console.log("Adding Health Record for Patient Address: %s", patientAddress);
        uint256 recordId = patientHealthRecords[patientAddress].length + 1;

        // Create and push the new record
        patientHealthRecords[patientAddress].push(
            HealthRecord(
                recordId,
                patientAddress,
                diagnosis,
                treatment,
                block.timestamp,
                msg.sender // AddedBy: current caller (appointed-doctor or patient)
            )
        );

        console.log("Health Record added successfully for Patient: %s by: %s", patientAddress, msg.sender);
        emit AddHealthRecord(recordId, patientAddress, msg.sender, block.timestamp);
    }

    // View health records
    function viewHealthRecords(address patientAddress) public view canViewHealthRecord(patientAddress) returns (HealthRecord[] memory) {
        return patientHealthRecords[patientAddress];
    }

    // Issue prescription
    function issuePrescription(
        address patientAddress,
        string memory medication,
        string memory dosage
    ) public onlyAuthorizedHealthServiceProvider {
        console.log("Issuing Prescription for Patient Address: %s", patientAddress);
        uint256 prescriptionId = patientPrescriptions[patientAddress].length + 1;

        // Create and push the new prescription
        patientPrescriptions[patientAddress].push(
            Prescription(
                prescriptionId,
                patientAddress,
                medication,
                dosage,
                block.timestamp,
                msg.sender // IssuedBy: current caller (doctor)
            )
        );

        console.log("Prescription issued successfully for Patient: %s by: %s", patientAddress, msg.sender);
        emit IssuePrescription(prescriptionId, patientAddress, msg.sender, block.timestamp);
    }

    // View prescriptions
    function viewPrescriptions(address patientAddress) public view canViewHealthRecord(patientAddress) returns (Prescription[] memory) {
        return patientPrescriptions[patientAddress];
    }

    // Update emergency contact
    function updateEmergencyContact(
        string memory name,
        string memory phone,
        string memory relationship
    ) public {
        console.log("Updating Emergency Contact for Patient Address: %s", msg.sender);

        // Update emergency contact
        patientEmergencyContacts[msg.sender] = EmergencyContact(name, phone, relationship);

        console.log("Emergency Contact updated successfully for Patient: %s", msg.sender);
        emit UpdateEmergencyContact(msg.sender, name, phone, relationship, block.timestamp);
    }

    // View emergency contact
    function viewEmergencyContact(address patientAddress) public view canViewHealthRecord(patientAddress) returns (EmergencyContact memory) {
        return patientEmergencyContacts[patientAddress];
    }
}
