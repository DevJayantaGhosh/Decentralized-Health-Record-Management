// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.7.0 <0.9.0;

import "hardhat/console.sol";

contract HealthRecordManagement {
    address private owner;

    struct HealthRecord {
        uint256 recordId;
        address patientAddress;
        int16 height;
        int16 weight;
        string bloodPressure;
        string cholesterol;
        string diagnosis;
        string treatment;
        uint256 timeStamp;
        address addedBy;
    }

    struct Doctor {
        address doctorAddress;
        string qualification;
        string specialization;
        int256 fees;
        bool status; // true = authorized
        uint256 timeStamp;
        address addedBy;
    }

    Doctor[] private doctors;

    mapping(address => bool) private doctorAuthorizationStatus;
    mapping(address => address[]) private patientToDoctors;
    mapping(address => address[]) private doctorToPatients;
    mapping(address => HealthRecord[]) private patientHealthRecords;

    event RegisterAuthorizedDoctor(
        address indexed doctorAddress,
        string qualification,
        string specialization,
        int256 fees,
        bool status,
        uint256 timeStamp,
        address indexed registeredBy
    );

    event DeRegisterAuthorizedDoctor(
        address indexed doctorAddress,
        bool deregisterStatus,
        string reason,
        uint256 timeStamp,
        address indexed deRegisteredBy
    );

    event TransferFeesAndBookAppointment(
        address indexed fromPatientAddress,
        address indexed toHealthServiceProviderAddress,
        uint256 fees,
        string reason,
        uint256 timeStamp
    );

    event AddHealthRecord(
        uint256 recordId,
        address indexed patientAddress,
        int16 height,
        int16 weight,
        string bloodPressure,
        string cholesterol,
        string diagnosis,
        string treatment,
        uint256 timeStamp,
        address indexed addedBy
    );

    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can perform this action");
        _;
    }

    modifier onlyAuthorizedHealthServiceProvider() {
        require(doctorAuthorizationStatus[msg.sender] == true, "Only authorized health service provider can perform this action");
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

    constructor() {
        owner = msg.sender;
        console.log("Decentralized Health Record Management contract deployed by:", msg.sender);
    }

    function registerDoctor(
        address _doctorAddress,
        string memory _qualification,
        string memory _specialization,
        int256 _fees
    ) public onlyOwner {
        require(!doctorAuthorizationStatus[_doctorAddress], "Doctor already authorized");

        Doctor memory newDoctor = Doctor({
            doctorAddress: _doctorAddress,
            qualification: _qualification,
            specialization: _specialization,
            fees: _fees,
            status: true,
            timeStamp: block.timestamp,
            addedBy: msg.sender
        });

        doctors.push(newDoctor);
        doctorAuthorizationStatus[_doctorAddress] = true;

        emit RegisterAuthorizedDoctor(
            _doctorAddress,
            _qualification,
            _specialization,
            _fees,
            true,
            block.timestamp,
            msg.sender
        );
    }

    function deregisterDoctor(address _doctorAddress, string memory _reason) public onlyOwner {
        require(doctorAuthorizationStatus[_doctorAddress], "Doctor is not authorized");

        doctorAuthorizationStatus[_doctorAddress] = false;

        emit DeRegisterAuthorizedDoctor(
            _doctorAddress,
            false,
            _reason,
            block.timestamp,
            msg.sender
        );
    }

    function assignDoctorToPatient(address _doctorAddress) public {
        require(doctorAuthorizationStatus[_doctorAddress], "Doctor is not authorized");

        address _patientAddress = msg.sender;

        patientToDoctors[_patientAddress].push(_doctorAddress);
        doctorToPatients[_doctorAddress].push(_patientAddress);
    }

    function bookAppointment(address payable _doctorAddress, string memory _reason) public payable {
        require(msg.sender != _doctorAddress, "Self-booking not allowed");

        Doctor memory doc;
        bool found = false;

        for (uint256 i = 0; i < doctors.length; i++) {
            if (doctors[i].doctorAddress == _doctorAddress) {
                doc = doctors[i];
                found = true;
                break;
            }
        }

        require(found, "Doctor not found");
        require(doctorAuthorizationStatus[_doctorAddress], "Doctor is not authorized");
        require(msg.value >= uint256(doc.fees), "Insufficient fees for appointment");

        // Transfer fees
        _doctorAddress.transfer(msg.value);

        // Add mapping
        patientToDoctors[msg.sender].push(_doctorAddress);
        doctorToPatients[_doctorAddress].push(msg.sender);

        emit TransferFeesAndBookAppointment(
            msg.sender,
            _doctorAddress,
            msg.value,
            _reason,
            block.timestamp
        );
    }


    function addHealthRecord(
        address _patientAddress,
        int16 _height,
        int16 _weight,
        string memory _bloodPressure,
        string memory _cholesterol,
        string memory _diagnosis,
        string memory _treatment
    ) public canAddHealthRecord(_patientAddress) {
        uint256 newRecordId = patientHealthRecords[_patientAddress].length + 1;

        HealthRecord memory newRecord = HealthRecord({
            recordId: newRecordId,
            patientAddress: _patientAddress,
            height: _height,
            weight: _weight,
            bloodPressure: _bloodPressure,
            cholesterol: _cholesterol,
            diagnosis: _diagnosis,
            treatment: _treatment,
            timeStamp: block.timestamp,
            addedBy: msg.sender
        });

        patientHealthRecords[_patientAddress].push(newRecord);

        emit AddHealthRecord(
            newRecordId,
            _patientAddress,
            _height,
            _weight,
            _bloodPressure,
            _cholesterol,
            _diagnosis,
            _treatment,
            block.timestamp,
            msg.sender
        );
    }

    function viewHealthRecords(address _patientAddress) public view canViewHealthRecord(_patientAddress) returns (HealthRecord[] memory) {
        return patientHealthRecords[_patientAddress];
    }

    function isDoctorOfPatient(address _doctor, address _patient) internal view returns (bool) {
        address[] memory doctorsOfPatient = patientToDoctors[_patient];
        for (uint256 i = 0; i < doctorsOfPatient.length; i++) {
            if (doctorsOfPatient[i] == _doctor) {
                return true;
            }
        }
        return false;
    }

    function getAllDoctors() public view returns (Doctor[] memory) {
        return doctors;
    }

    function getAssignedDoctors(address _patientAddress) public view returns (address[] memory) {
        return patientToDoctors[_patientAddress];
    }

    function getPatientsOfDoctor(address _doctorAddress) public view returns (address[] memory) {
        return doctorToPatients[_doctorAddress];
    }

    function getOwner() public view returns (address) {
        return owner;
    }
}
