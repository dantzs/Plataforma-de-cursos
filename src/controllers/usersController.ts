import { Response } from "express";
import { AuthenticatedRequest } from "../middlewares/auth";
import { userServices } from "../services/userServices";

export const usersConstroller = {
  //GET /users/current/watching

  watching: async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user!

    try {
      const watching = await userServices.getKeepWatchingList(id)
      return res.json(watching)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  //GET /users/account
  show: async( req: AuthenticatedRequest, res: Response) => {
    const currentUser = req.user!

    try {
      return res.json(currentUser)
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },

  //PUT /users/account

  uptade: async(req: AuthenticatedRequest, res: Response) => {
    const { id } = req.user!
    const { firstName, lastName, phone, email, birth } = req.body


    try {
      const uptadedUser = await userServices.update(id, {
        firstName, 
        lastName, 
        phone, 
        birth,
        email
      })
      return res.json(uptadedUser)
      
    } catch (err) {
      if (err instanceof Error) {
        return res.status(400).json({ message: err.message })
      }
    }
  },
  
  //PUT /users/account/password
  updetedPassword: async(req: AuthenticatedRequest, res: Response) => {
    const user = req.user!
    const { currentPassword, newPassword } = req.body

    user.checkPassword(currentPassword, async (err, isSame) => {
      try {
        if(err) return res.status(400).json({ message: err.message})

        if(!isSame) return res.status(400).json({ message: "Senha Incorreta"})
  
        await userServices.updatePassword(user.id, newPassword)
        return res.status(204).send()
        
      } catch (err) {
        if (err instanceof Error) {
          return res.status(400).json({ message: err.message })
        }
      }
    })
  }
};
