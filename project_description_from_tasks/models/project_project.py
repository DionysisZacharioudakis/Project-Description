from odoo import models


class ProjectProject(models.Model):
    _inherit = "project.project"

    def action_toggle_project_description_inline(self):
        """Marker action handled by the task control panel in the web client."""
        self.ensure_one()
        return False
