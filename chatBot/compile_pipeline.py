from kfp import compiler
from deploy_pipeline import fyp_deployment_pipeline

if __name__ == "__main__":
    compiler.Compiler().compile(
        pipeline_func=fyp_deployment_pipeline,
        package_path="fyp_deploy_pipeline.yaml"
    )
