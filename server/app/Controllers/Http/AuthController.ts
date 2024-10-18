import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { schema } from "@ioc:Adonis/Core/Validator";
import User from "../../Models/User";
import Hash from "@ioc:Adonis/Core/Hash";

export default class AuthController {
  /**
   * @login
   * @param email - L'adresse email de l'utilisateur
   * @param password - Le mot de passe de l'utilisateur
   * @responseBody 200 - {"token": "xxxxxxx"}
   */
  public async login({ request, auth, response }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
    });
    const { email, password } = await request.validate({
      schema: validationSchema,
    });

    try {
      const token = await auth.use("api").attempt(email, password);
      const user = await User.query()
        .where("id", token.user.id)
        .preload("role")
        .preload("profile")
        .firstOrFail();

      return response.ok({
        message: "Connexion réussie",
        token: token.token,
        user: user,
      });
    } catch (error) {
      return response.unauthorized({
        message: "Identifiants invalides",
      });
    }
  }

  public async register({ request, auth, response }: HttpContextContract) {
    const validationSchema = schema.create({
      email: schema.string({ trim: true }),
      password: schema.string({ trim: true }),
      name: schema.string({ trim: true }),
    });
    const { email, password, name } = await request.validate({
      schema: validationSchema,
    });
    try {
      const existingUser = await User.query()
        .where("email", email)
        .preload("role")
        .preload("profile")
        .first();
      if (existingUser) {
        return response.conflict({
          message: "Utilisateur déjà existant",
        });
      }

      // Hash the password
      const hashedPassword = await Hash.make(password);

      const user = await User.create({ email, password: hashedPassword, name });
      const token = await auth.use("api").login(user);
      return response.created({
        message: "Utilisateur créé avec succès",
        token: token.token,
        user: token.user,
      });
    } catch (error) {
      console.log(error);
      return response.internalServerError({
        message: "Une erreur est survenue lors de la création de l'utilisateur",
      });
    }
  }

  public async logout({ auth }: HttpContextContract) {
    await auth.use("api").logout();
    return { message: "Logged out" };
  }

  public async me({ auth }: HttpContextContract) {
    return auth.use("api").user;
  }
}
