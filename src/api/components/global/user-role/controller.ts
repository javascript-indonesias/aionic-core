import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { UserRoleService } from './service';
import { UserRole } from './model';

export class UserRoleController {
	private readonly service: UserRoleService = new UserRoleService();

	/**
	 * Read user roles
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readUserRoles(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const userRoles: UserRole[] = await this.service.readUserRoles({}, true);

			return res.json({ status: res.statusCode, data: userRoles });
		} catch (err) {
			return next(err);
		}
	}

	/**
	 * Create user role
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async createUserRole(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const { userRole } = req.body;

			if (!userRole) {
				return res.status(400).json({ status: 400, error: 'Invalid request' });
			}

			const newUserRole: UserRole = await this.service.saveUserRole(userRole);

			return res.json({ status: res.statusCode, data: newUserRole });
		} catch (err) {
			return next(err);
		}
	}
}
