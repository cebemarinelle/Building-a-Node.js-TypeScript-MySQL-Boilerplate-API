import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config.json';
import db from '../_helpers/db';

function authorize(roles: string[] = []) {
  return [
    jwtMiddleware,
    async function authorizationMiddleware(req: any, res: Response, next: NextFunction) {
      const account = await db.Account.findByPk(req.user.id);
      
      if (!account) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      const isAuthorized = roles.length === 0 || roles.includes(account.role);
      
      if (!isAuthorized) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      
      req.user.role = account.role;
      req.user.ownsToken = (token: string) => !!account.refreshTokens?.find((x: any) => x.token === token);
      
      next();
    }
  ];
  
  function jwtMiddleware(req: any, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    jwt.verify(token, config.jwtSecret, (err: any, user: any) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized' });
      }
      req.user = user;
      next();
    });
  }
}

export default authorize;