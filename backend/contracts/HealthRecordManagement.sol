// SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract HealthRecordManagement{
    address private owner;

    struct HealthRecord{
        uint recordId;
        address patientAddress;
        string diagonosis;
        string treatment;
        uint timeStamp;
        address addedBy;
    }


    // Mappings
    mapping(address => bool) private authorizedHealthServiceProviders; // Tracks authorized healthcare provider Address - bool
    mapping(address => address[]) private patientToDoctors; // Maps a patient to a list of doctors
    mapping(address => address[]) private doctorToPatients; // Maps a doctor to a list of patients
    mapping(address => HealthRecord[]) private patientHealthRecords; //patienttAddress - array of healthRecords


    //events
    event RegisterAuthorizedHealthServiceProvider(address healthServiceProviderAddress,bool registerStatus,address updateBy,uint timeStamp);
    event DeRegisterAuthorizedHealthServiceProvider(address healthServiceProviderAddress,bool deRegisterStatus,address updateBy,uint timeStamp);
    event TransferFeesAndBookAppointment(address fromPatientAddress, address toHealthServiceProviderAddress, uint fees, uint timeStamp);
    event AddHealthRecord(uint recordId,address patientAddress, address addedBy ,uint timeStamp);

    //Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }
    modifier onlyAuthorizedHealthServiceProvider(){
        require (authorizedHealthServiceProviders[msg.sender], "Only authorized health service provider can perform this action");
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
            "Access restricted to the patient or their appointed doctor Only"
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


    // Register an authorized healthcare service provider
    function registerHealthCareServiceProvider(address _healthServiceProvider) public onlyOwner {
        require(_healthServiceProvider != address(0), "Invalid address: address cannot be null");
        require(!authorizedHealthServiceProviders[_healthServiceProvider], 
            "Health Service Provider is already registered");

        authorizedHealthServiceProviders[_healthServiceProvider] = true;
        console.log("%s registered successfully as an authorized HealthCare Service Provider", _healthServiceProvider);
        emit RegisterAuthorizedHealthServiceProvider(_healthServiceProvider, true, owner, block.timestamp);
    }

    // Deregister a healthcare service provider
    function deregisterHealthCareServiceProvider(address _healthServiceProvider) public onlyOwner {
        require(_healthServiceProvider != address(0), "Invalid address: address cannot be null");
        require(authorizedHealthServiceProviders[_healthServiceProvider], 
            "Health Service Provider is not currently registered");

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
        string memory diagonosis,
        string memory treatment
    ) public canAddHealthRecord(patientAddress){

        console.log("Adding Health Record for Patient Address: %s", patientAddress);
        uint256 recordId = patientHealthRecords[patientAddress].length + 1;

        // Create and push the new record
        patientHealthRecords[patientAddress].push(
            HealthRecord(
                recordId,
                patientAddress,
                diagonosis,
                treatment,
                block.timestamp,
                msg.sender // AddedBy: current caller (appointed-doctor or patient)
            )
        );

        console.log("Health Record added successfully for Patient: %s by: %s", patientAddress, msg.sender);
        emit AddHealthRecord(recordId, patientAddress, msg.sender,block.timestamp);
    }

    // View health records
    function viewHealthRecords(address patientAddress) public view canViewHealthRecord(patientAddress)  returns (HealthRecord[] memory) {
        return patientHealthRecords[patientAddress];
    }


}