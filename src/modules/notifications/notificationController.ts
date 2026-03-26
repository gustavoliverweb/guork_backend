import { PaginationRequest } from "../../shared/types/paginationRequest";
import NotificationsService from "./notificationService";
import { Request, Response } from "express";
export default class NotificationController {
  private ntfService: NotificationsService;
  constructor() {
    this.ntfService = new NotificationsService();
  }
  getAllNtfs = async (req: Request, res: Response): Promise<void> => {
    try {
      const pagination: PaginationRequest = {
        page: Number.parseInt((req.query.page as string) || "1", 10),
        pageSize: Number.parseInt((req.query.pageSize as string) || "10", 10),
        sortBy: (req.query.sortBy as string) || undefined,
        sortOrder: req.query.sortOrder as string as "asc" | "desc" | undefined,
        search: (req.query.search as string) || undefined,
        status: (req.query.status as string) || undefined,
      };
      const data = await this.ntfService.getNotifications(pagination);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ error });
    }
  };
}
