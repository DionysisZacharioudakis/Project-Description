from odoo import _, models


class ProjectProject(models.Model):
    _inherit = "project.project"

    def action_open_description_from_tasks(self):
        """Open this project's description in a focused modal form."""
        self.ensure_one()
        return {
            "type": "ir.actions.act_window",
            "name": _("Project Description"),
            "res_model": "project.project",
            "res_id": self.id,
            "views": [
                (
                    self.env.ref(
                        "project_description_from_tasks.project_description_dialog_view"
                    ).id,
                    "form",
                )
            ],
            "target": "new",
            "context": {
                **self.env.context,
                "form_view_initial_mode": "edit",
            },
        }

