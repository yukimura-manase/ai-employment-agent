from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel

# camelcase configs (pydantic V2版)
class BaseSchema(BaseModel):  
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
    )