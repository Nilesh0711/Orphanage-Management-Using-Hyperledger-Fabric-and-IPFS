class Orphan {
  constructor(
    id,
    name,
    gender,
    dob,
    yearOfEnroll,
    isAdopted,
    org,
    background
  ) {
    this.id = id;
    this.name = name;
    this.gender = gender;
    this.dob = dob;
    this.yearOfEnroll = yearOfEnroll;
    this.isAdopted = isAdopted;
    this.org = org;
    this.background = background;
    this.changedBy = [],
    this.allergies = [],
    this.diagnosis = [],
    this.treatment = [],
    this.disfigurements = [],
    this.permissionGranted = []
    return this;
  }
}
module.exports = Orphan;
