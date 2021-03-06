import { bind } from 'decko';
import { NextFunction, Request, Response } from 'express';

import { TaskPriorityService } from './service';
import { TaskPriority } from './model';

export class TaskPriorityController {
	private readonly service: TaskPriorityService = new TaskPriorityService();

	/**
	 * Read task priorities
	 *
	 * @param req Express request
	 * @param res Express response
	 * @param next Express next
	 * @returns Returns HTTP response
	 */
	@bind
	public async readTaskPriorities(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
		try {
			const taskPriorities: TaskPriority[] = await this.service.readTaskPriorities({}, true);

			return res.json({ status: res.statusCode, data: taskPriorities });
		} catch (err) {
			return next(err);
		}
	}
}
