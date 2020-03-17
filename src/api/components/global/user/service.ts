import { bind } from 'decko';
import { Like, Repository, FindConditions, getManager, FindManyOptions, FindOneOptions } from 'typeorm';

import { IComponentServiceStrict } from '../../index';

import { NodeCacheService } from '@services/cache/node-cache';

import { User } from './model';
import { ApplicationSymbols } from '@config/globals';
import { Task } from '@milestone/task/model';
import { TaskService } from '@milestone/task/service';

export class UserService implements IComponentServiceStrict<User> {
	readonly defaultRelations: string[] = [
		'userRole',
		'assignee',
		'tasksWatched',
		'tasksWatched.assignee',
		'tasksWatched.status',
		'projectsWatched'
	];

	readonly cacheService: NodeCacheService = new NodeCacheService();

	readonly repo: Repository<User> = getManager().getRepository(User);

	readonly taskService: TaskService = new TaskService();

	/**
	 * Read all users from db
	 *
	 * @param options Find options
	 * @param cached Read users from cache
	 * @returns Returns an array of users
	 */
	@bind
	public readAll(options: FindManyOptions<User> = {}, cached: boolean = false): Promise<User[]> {
		try {
			if (Object.keys(options).length) {
				return this.repo.find({
					relations: this.defaultRelations,
					...options
				});
			}

			if (cached) {
				return this.cacheService.get('users', this.readAll);
			}

			return this.repo.find({
				relations: this.defaultRelations
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain user from db
	 *
	 * @param options Find options
	 * @returns Returns a single user
	 */
	@bind
	public read(options: FindOneOptions<User> = {}): Promise<User | undefined> {
		try {
			return this.repo.findOne({
				relations: this.defaultRelations,
				...options
			});
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Save new or updated user to db
	 *
	 * @param user User to save
	 * @returns Returns saved user
	 */
	@bind
	public async save(user: User): Promise<User> {
		try {
			const newUser: User = await this.repo.save(user);

			// Clear user cache
			this.cacheService.delete('users');

			return newUser;
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Delete user from db
	 *
	 * @param user User to delete
	 * @returns Returns deleted user
	 */
	@bind
	public async delete(user: User): Promise<User> {
		try {
			const deletedUser = await this.repo.remove(user);

			// Clear user cache
			this.cacheService.delete('users');

			return deletedUser;
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read user for signin
	 *
	 * @param client Client application
	 * @param email User email
	 * @returns Returns user
	 */
	@bind
	public readSigninUser(client: ApplicationSymbols, email: string): Promise<User | undefined> {
		try {
			let relations: string[] = [];

			switch (client) {
				case ApplicationSymbols.milestone:
					relations = [
						'userRole',
						'assignee',
						'tasksWatched',
						'tasksWatched.assignee',
						'tasksWatched.status',
						'projectsWatched'
					];
					break;
				default:
					relations = ['userRole'];
					break;
			}

			const options: FindOneOptions<User> = {
				relations,
				select: ['id', 'email', 'firstname', 'lastname', 'password'],
				where: {
					email,
					active: true
				}
			};

			return this.read(options);
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read users from db by username
	 *
	 * @param username Username to search for
	 * @returns Returns an array of users
	 */
	@bind
	public readUsersByUsername(username: string): Promise<User[]> {
		try {
			let where: FindConditions<User> = {};

			if (username) {
				const [firstname, lastname] = username.split(' ');

				if (firstname) {
					where = { ...where, firstname: Like(`%${firstname}%`) };
				}

				if (lastname) {
					where = { ...where, lastname: Like(`%${lastname}%`) };
				}
			}

			return this.readAll({ where });
		} catch (err) {
			throw new Error(err);
		}
	}

	/**
	 * Read a certain user from db
	 *
	 * @param options Find options
	 * @returns Returns a single user
	 */
	@bind
	public readUserTasks(user: User): Promise<Task[]> {
		try {
			return this.taskService.readAll({
				order: {
					priority: 'DESC'
				},
				where: {
					assignee: user,
					completed: false
				}
			});
		} catch (err) {
			throw new Error(err);
		}
	}
}
