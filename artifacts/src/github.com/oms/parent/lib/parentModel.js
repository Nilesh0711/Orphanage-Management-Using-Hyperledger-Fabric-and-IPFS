class Parent {
  constructor(
    id,
    name,
    isMarried,
    email,
    orphanId,
    phone,
    address,
    occupation,
    org
  ) {
    this.id = id;
    this.name = name;
    this.isMarried = isMarried;
    this.email = email;
    this.orphanId = orphanId;
    this.phone = phone;
    this.address = address;
    this.org = org;
    this.occupation = occupation;
    return this;
  }
}
module.exports = Parent;
