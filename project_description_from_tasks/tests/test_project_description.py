from odoo.tests.common import TransactionCase


class TestProjectDescriptionAction(TransactionCase):
    def test_description_action_targets_current_project(self):
        project = self.env["project.project"].create({"name": "Test Project"})

        action = project.action_open_description_from_tasks()

        self.assertEqual(action["res_model"], "project.project")
        self.assertEqual(action["res_id"], project.id)
        self.assertEqual(action["target"], "new")
        self.assertEqual(action["views"][0][1], "form")

