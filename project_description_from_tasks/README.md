# Project Description from Tasks

Odoo 19 add-on that adds **Project Description** to the task view's existing top
menu for a specific project.

The menu button expands a focused editor directly above the task view. Users can
read or edit the project's existing HTML `description` field while the tasks
remain visible. Access continues to follow the user's normal Odoo permissions,
and no duplicate field or synchronized copy is created.

## Installation

1. Copy `project_description_from_tasks` into a directory included in Odoo's
   `addons_path`.
2. Restart Odoo and update the Apps list.
3. Search for **Project Description from Tasks** and install it.
4. If upgrading an existing installation, upgrade this module and hard-refresh
   the browser so the new backend assets are loaded.

## Usage

Open **Project > Projects**, enter a project, and open its tasks. Select
enable **Top Menu** from the sliders menu if it is hidden, and select **Project
Description** beside Tasks and Dashboard. Edit the description and select
**Save** or **Discard**.

The button is intentionally hidden in global task views because those views can
contain tasks from multiple projects.

