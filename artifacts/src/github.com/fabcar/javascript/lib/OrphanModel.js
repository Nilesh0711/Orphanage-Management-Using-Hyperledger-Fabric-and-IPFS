class Orphan {
    constructor(id,firstName,lastName,age,gender,org,background)
    {
        this.ID = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.Age = age;
        this.Gender = gender
        this.Org = org
        this.Background = background;
        this.PermissionGranted = ["adminorg1", "adminorg2"]
        return this;
    }
}
module.exports = Orphan