import faker from "faker";

export const fakeComment = () => ({
  pk: faker.random.number(),
  user: {
    username: `${faker.name.firstName()} ${faker.name.lastName()}`,
    profile_pic_url: `https://i.pravatar.cc/150?u=${faker.random.number()}`,
  },
  fake: true,
  text: faker.lorem.sentence(),
});
