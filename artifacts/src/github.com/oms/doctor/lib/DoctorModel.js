class Doctor {
  constructor(
    id,
    firstName,
    lastName,
    age,
    org,
    speciality,
    qualification,
    experience,
    phoneNo,
    personalAddress
  ) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.age = age;
    this.org = org;
    this.speciality = speciality;
    this.qualification = qualification;
    this.experience = experience;
    this.phoneNo = phoneNo;
    this.personalAddress = personalAddress;
    return this;
  }
}
module.exports = Doctor;
