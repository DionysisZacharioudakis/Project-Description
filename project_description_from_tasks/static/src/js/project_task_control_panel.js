import { _t } from "@web/core/l10n/translation";
import { setElementContent } from "@web/core/utils/html";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { ProjectTaskControlPanel } from "@project/views/project_task_control_panel/project_task_control_panel";
import { markup, onMounted, onPatched, useRef, useState } from "@odoo/owl";

const PROJECT_DESCRIPTION_METHOD = "action_toggle_project_description_inline";

patch(ProjectTaskControlPanel.prototype, {
    setup() {
        super.setup(...arguments);
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.projectDescriptionEditor = useRef("projectDescriptionEditor");
        this.projectDescription = useState({
            open: false,
            loading: false,
            loaded: false,
            saving: false,
            projectId: false,
            projectName: "",
            original: "",
            draft: "",
        });
        this.descriptionNeedsSync = false;
        onMounted(() => this.syncDescriptionEditor());
        onPatched(() => this.syncDescriptionEditor());
    },

    currentProjectId() {
        const context = this.env.searchModel.globalContext;
        return context.default_project_id || context.active_id || false;
    },

    hasCurrentProject() {
        return Boolean(this.currentProjectId());
    },

    isProjectDescriptionAction(action) {
        return action?.python_method === PROJECT_DESCRIPTION_METHOD;
    },

    async onEmbeddedActionClick(action) {
        if (this.isProjectDescriptionAction(action)) {
            await this.toggleProjectDescription();
            return;
        }
        return super.onEmbeddedActionClick(...arguments);
    },

    _setVisibility(actionId) {
        const action = this.state.embeddedInfos.embeddedActions.find(
            ({ id }) => id === actionId
        );
        const isVisible = this.state.embeddedInfos.visibleEmbeddedActions.includes(actionId);
        super._setVisibility(...arguments);
        if (isVisible && this.isProjectDescriptionAction(action)) {
            this.closeProjectDescription();
        }
    },

    async toggleProjectDescription() {
        const projectId = this.currentProjectId();
        if (!projectId) {
            return;
        }
        if (this.projectDescription.open) {
            this.closeProjectDescription();
            return;
        }

        this.projectDescription.open = true;
        if (this.projectDescription.projectId !== projectId) {
            await this.loadProjectDescription(projectId);
        } else {
            this.descriptionNeedsSync = true;
        }
    },

    closeProjectDescription() {
        if (this.projectDescriptionEditor.el) {
            this.projectDescription.draft = this.projectDescriptionEditor.el.innerHTML;
        }
        this.projectDescription.open = false;
    },

    async loadProjectDescription(projectId) {
        this.projectDescription.loading = true;
        this.projectDescription.loaded = false;
        try {
            const [project] = await this.orm.read(
                "project.project",
                [projectId],
                ["name", "description"]
            );
            const description = project.description || "";
            Object.assign(this.projectDescription, {
                projectId,
                projectName: project.name,
                original: description,
                draft: description,
                loaded: true,
            });
            this.descriptionNeedsSync = true;
        } finally {
            this.projectDescription.loading = false;
        }
    },

    syncDescriptionEditor() {
        if (!this.descriptionNeedsSync || !this.projectDescriptionEditor.el) {
            return;
        }
        // project.project.description is an Odoo-sanitized HTML field.
        setElementContent(
            this.projectDescriptionEditor.el,
            markup(this.projectDescription.draft)
        );
        this.descriptionNeedsSync = false;
    },

    async saveProjectDescription() {
        const editor = this.projectDescriptionEditor.el;
        if (!editor || !this.projectDescription.projectId) {
            return;
        }
        const description = editor.innerHTML;
        this.projectDescription.saving = true;
        try {
            await this.orm.write("project.project", [this.projectDescription.projectId], {
                description,
            });
            const [project] = await this.orm.read(
                "project.project",
                [this.projectDescription.projectId],
                ["description"]
            );
            const savedDescription = project.description || "";
            this.projectDescription.original = savedDescription;
            this.projectDescription.draft = savedDescription;
            this.descriptionNeedsSync = true;
            this.notification.add(_t("Project description saved."), { type: "success" });
        } finally {
            this.projectDescription.saving = false;
        }
    },

    discardProjectDescriptionChanges() {
        this.projectDescription.draft = this.projectDescription.original;
        this.descriptionNeedsSync = true;
        this.syncDescriptionEditor();
    },
});

