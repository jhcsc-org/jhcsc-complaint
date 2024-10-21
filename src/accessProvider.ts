import { AccessControlProvider } from "@refinedev/core";
import { newEnforcer } from "casbin";
import { adapter, model } from "./accessControl";

export const accessControlProvider: AccessControlProvider = {
    can: async ({ action, params, resource }) => {
        const enforcer = await newEnforcer(model, adapter);
        if (
          action === "delete" ||
          action === "edit" ||
          action === "show"
        ) {
          return Promise.resolve({
            can: await enforcer.enforce(
              "admin",
              `${resource}/${params?.id}`,
              action,
            ),
          });
        }
        if (action === "field") {
          return Promise.resolve({
            can: await enforcer.enforce(
              "admin",
              `${resource}/${params?.field}`,
              action,
            ),
          });
        }
        return {
          can: await enforcer.enforce("admin", resource, action),
        };
      },
};