{
    "name": "Project Description from Tasks",
    "summary": "View and edit a project's description directly from its task views",
    "version": "19.0.1.1.0",
    "category": "Services/Project",
    "author": "Dionysis",
    "license": "LGPL-3",
    "depends": ["project", "web"],
    "data": [],
    "assets": {
        "web.assets_backend": [
            "project_description_from_tasks/static/src/js/project_task_control_panel.js",
            "project_description_from_tasks/static/src/xml/project_task_control_panel.xml",
            "project_description_from_tasks/static/src/scss/project_task_control_panel.scss",
        ],
    },
    "installable": True,
    "application": False,
}

