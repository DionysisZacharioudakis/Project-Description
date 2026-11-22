# Project Description from Tasks

Odoo 19 add-on that adds **Project Description** as a native embedded action in
the task view's existing top menu for a specific project.

The menu button expands Odoo's native rich-text editor directly above the task
view. Users can format headings, lists, quotes, links, and text while the tasks
remain visible. It edits the project's existing HTML `description` field;
access continues to follow the user's normal Odoo permissions, and no duplicate
field or synchronized copy is created.

## Installation

1. Copy `project_description_from_tasks` into a directory included in Odoo's
   `addons_path`.
2. Restart Odoo and update the Apps list.
3. Search for **Project Description from Tasks** and install it.
4. If upgrading an existing installation, upgrade this module and hard-refresh
   the browser so the new backend assets are loaded.

## Usage

Open **Project > Projects**, enter a project, and open its tasks. Enable **Top
Menu** from the sliders menu if it is hidden. In that same menu, select
**Project Description** to show or hide its top-menu button. You can drag the
visible top-menu buttons to arrange them in your preferred order; Odoo saves
the visibility and order for your user. Select **Project Description** to open
the inline editor. After making a change, use the cloud **Save** or × **Discard**
controls beside the project breadcrumb, just like an Odoo form view.

When selected from Dashboard or another embedded project screen, **Project
Description** automatically opens the project's Tasks view and expands the
editor. Saving is intentionally silent; the cloud icon returning to its hidden
state confirms that the description was saved.

The button is intentionally hidden in global task views because those views can
contain tasks from multiple projects.

