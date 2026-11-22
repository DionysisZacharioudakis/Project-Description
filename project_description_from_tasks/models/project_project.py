from odoo import models


class ProjectProject(models.Model):
    _inherit = "project.project"

    def action_toggle_project_description_inline(self):
        """Open Tasks with the inline project description expanded."""
        self.ensure_one()
        action = self.action_view_tasks()
        action["context"]["open_project_description"] = True
        return action
