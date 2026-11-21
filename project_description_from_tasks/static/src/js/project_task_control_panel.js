/** @odoo-module **/

import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { ProjectTaskControlPanel } from "@project/views/project_task_control_panel/project_task_control_panel";

patch(ProjectTaskControlPanel.prototype, {
    setup() {
        super.setup(...arguments);
        this.actionService = useService("action");
        this.orm = useService("orm");
    },

    get currentProjectId() {
        return this.env.searchModel.globalContext.default_project_id || false;
    },

    get hasCurrentProject() {
        return Boolean(this.currentProjectId);
    },

    async onOpenProjectDescription() {
        if (!this.currentProjectId) {
            return;
        }
        const action = await this.orm.call(
            "project.project",
            "action_open_description_from_tasks",
            [[this.currentProjectId]]
        );
        await this.actionService.doAction(action);
    },
});

