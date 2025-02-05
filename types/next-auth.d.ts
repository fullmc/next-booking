import "next-auth"

declare module "next-auth" {
  interface ISession {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role: string
    }
  }
}