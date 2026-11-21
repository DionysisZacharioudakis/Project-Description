# Project Description from Tasks

Odoo 19 add-on that adds a **Project Description** button to the control panel of
the task views for a specific project.

The button opens a focused modal containing the project's existing HTML
`description` field. Users can read or edit the value according to their normal
Odoo access rights. No duplicate field or synchronized copy is created.

## Installation

1. Copy `project_description_from_tasks` into a directory included in Odoo's
   `addons_path`.
2. Restart Odoo and update the Apps list.
3. Search for **Project Description from Tasks** and install it.
4. If upgrading an existing installation, upgrade this module and hard-refresh
   the browser so the new backend assets are loaded.

## Usage

Open **Project > Projects**, enter a project, and open its tasks. Select
**Project Description** in the top control bar. Edit the description and use
the modal's standard **Save** or **Discard** action.

The button is intentionally hidden in global task views because those views can
contain tasks from multiple projects.

