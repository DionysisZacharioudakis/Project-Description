import { _t } from "@web/core/l10n/translation";
import { useService } from "@web/core/utils/hooks";
import { patch } from "@web/core/utils/patch";
import { Wysiwyg } from "@html_editor/wysiwyg";
import { ProjectTaskControlPanel } from "@project/views/project_task_control_panel/project_task_control_panel";
import { markup, useState } from "@odoo/owl";

const PROJECT_DESCRIPTION_METHOD = "action_toggle_project_description_inline";

ProjectTaskControlPanel.components = {
    ...ProjectTaskControlPanel.components,
    Wysiwyg,
};

patch(ProjectTaskControlPanel.prototype, {
    setup() {
        super.setup(...arguments);
        this.orm = useService("orm");
        this.notification = useService("notification");
        this.projectDescriptionEditor = null;
        this.projectDescription = useState({
            open: false,
            loading: false,
            loaded: false,
            saving: false,
            projectId: false,
            projectName: "",
            original: "",
            draft: "",
            editorKey: 0,
        });
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
        }
    },

    closeProjectDescription() {
        if (this.projectDescriptionEditor) {
            this.projectDescription.draft = this.projectDescriptionEditor.getContent();
        }
        this.projectDescription.open = false;
        this.projectDescriptionEditor = null;
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
                editorKey: this.projectDescription.editorKey + 1,
            });
        } finally {
            this.projectDescription.loading = false;
        }
    },

    getProjectDescriptionEditorConfig() {
        return {
            // The value comes from Odoo's sanitized project.project.description HTML field.
            content: markup(this.projectDescription.draft),
            baseContainers: ["DIV", "P"],
            placeholder: _t('Type "/" for commands'),
            allowImage: false,
            allowFile: false,
            allowVideo: false,
        };
    },

    onProjectDescriptionEditorLoad(editor) {
        this.projectDescriptionEditor = editor;
    },

    async saveProjectDescription() {
        const editor = this.projectDescriptionEditor;
        if (!editor || !this.projectDescription.projectId) {
            return;
        }
        const description = editor.getContent();
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
            this.projectDescription.editorKey++;
            this.notification.add(_t("Project description saved."), { type: "success" });
        } finally {
            this.projectDescription.saving = false;
        }
    },

    discardProjectDescriptionChanges() {
        this.projectDescription.draft = this.projectDescription.original;
        this.projectDescription.editorKey++;
    },
});

