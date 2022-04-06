const User = require('../models/Schema_User')
const bcrypt = require('bcrypt')
const { api } = require('../tests/helperCode')
describe.only('Creating a new user', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('pswd', 10)
    const user = new User({
      username: 'susan',
      name: 'susu',
      passwd: passwordHash
    })
    await user.save()
  })
  // ^ Comienzan los test
  test('works as expected creating a fresh username', async () => {
    const userDB = await User.find({})
    const usersAtStart = userDB.map(user => user.toJSON())
    const newUser = {
      username: 'susan',
      name: 'susana',
      passwd: '1234'
    }
    await api
      .post('/api/user')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const userDBAfter = await User.find({})
    const usersAtEnd = userDBAfter.map(user => user.toJSON())
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
})
