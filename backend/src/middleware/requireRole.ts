import { Response, NextFunction } from "express";
import { AuthedRequest } from "./clerkAuth";
import RecruitmentProfile, { AccountType } from "../modules/recruitment/model";

export interface RoleRequest extends AuthedRequest {
  accountType?: AccountType;
  profileId?: string;
}
export function requireRole(...allowed: AccountType[]) {
  return async (req: RoleRequest, res: Response, next: NextFunction) => {
    if (!req.userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    try {
      const profile = await RecruitmentProfile.findOne({
        clerkUserId: req.userId,
        active: true,
      }).select("accountType");

      if (!profile) {
        // 403 rather than 404: do not reveal whether a profile exists.
        res.status(403).json({ error: "No recruitment profile for this account" });
        return;
      }

      if (allowed.length && !allowed.includes(profile.accountType)) {
        res.status(403).json({ error: "Forbidden" });
        return;
      }

      req.accountType = profile.accountType;
      req.profileId = String(profile._id);
      next();
    } catch (err) {
      console.error("requireRole error:", err);
      res.status(403).json({ error: "Forbidden" });
    }
  };
}
