import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";
import User from "App/Models/User";
import Hash from "@ioc:Adonis/Core/Hash";
import Role from "App/Models/Role";

export default class UserSeeder extends BaseSeeder {
  public async run() {
    const users = [
      {
        name: "Admin",
        email: "admin@admin.com",
        password: "admin",
        profile: {
          avatar: "/placeholder.svg?height=80&width=80",
          firstName: "Rafiqur",
          lastName: "Rahman",
          city: "Paris",
          state: "Ile-de-France",
          zip: "75000",
          address: "123 Rue de la Paix",
          phone: "+33 6 34 53 46 46",
        },
      },
      {
        name: "Admin2",
        email: "admin2@admin.com",
        password: "admin2",
        profile: {
          avatar: "/placeholder.svg?height=80&width=80",
          firstName: "Rafiqur2",
          lastName: "Rahman2",
          city: "Paris2",
          state: "Ile-de-France2",
          zip: "750002",
          address: "123 Rue de la Paix2",
          phone: "+33 6 34 53 46 462",
        },
      },
    ];

    const adminRole = await Role.firstOrCreate({ name: "admin" });

    for (const userData of users) {
      const { profile, ...userInfo } = userData;
      const user = await User.create({
        ...userInfo,
        password: await Hash.make(userInfo.password),
        roleId: adminRole.id,
      });

      await user.related("profile").create(profile);
    }
  }
}
