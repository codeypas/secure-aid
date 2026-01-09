from kfp import dsl

MANIFEST_PATH = "/k8s"
IMAGE = "010123070122/fyp-kubectl:latest"

@dsl.container_component
def apply_manifest_op(manifest_path: str):
    return dsl.ContainerSpec(
        image=IMAGE,
        command=["kubectl", "apply", "-f", manifest_path]
    )

@dsl.pipeline(
    name="Final Year Project Deployment",
    description="Deploy namespace and all backend/frontend/email-server services"
)
def fyp_deployment_pipeline():
    ns_task = apply_manifest_op(manifest_path=f"{MANIFEST_PATH}/namespace.yaml")
    backend_task = apply_manifest_op(manifest_path=f"{MANIFEST_PATH}/backend-deployment.yaml").after(ns_task)
    frontend_task = apply_manifest_op(manifest_path=f"{MANIFEST_PATH}/frontend-deployment.yaml").after(backend_task)
    email_task = apply_manifest_op(manifest_path=f"{MANIFEST_PATH}/email-server-deployment.yaml").after(frontend_task)
