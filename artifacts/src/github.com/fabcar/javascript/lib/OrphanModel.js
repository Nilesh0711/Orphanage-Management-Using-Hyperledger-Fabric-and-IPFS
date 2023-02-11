// class Orphan {
//     constructor(id,firstName,lastName,age,gender,org,background)
//     {
//         this.ID = id;
//         this.firstName = firstName;
//         this.lastName = lastName;
//         this.Age = age;
//         this.Gender = gender
//         this.Org = org
//         this.Background = background;
//         this.PermissionGranted = ["adminorg1", "adminorg2"]
//         return this;
//     }
// }
// module.exports = Orphan

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
