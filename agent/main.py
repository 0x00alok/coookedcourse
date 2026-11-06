from pathlib import Path
import time

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import JSONResponse
from pydantic import BaseModel 
from langchain.prompts.prompt import PromptTemplate
from langchain.chat_models import init_chat_model

from cookedcourseagent.CookedCourseAgent import CookedCourseAgent
from prompts import SYLLABUS_ANALYSIS_PROMPT


# Max Playlists to Consider 
MAX_PLAYLISTS_TO_ITERATE = 2

app = FastAPI()

class Syllabus(BaseModel):
    syllabus: list[str]

class YTAndSyllabusTopics(BaseModel):
    syllabus_topics: list[dict]
    channel_topics: dict

class SyllabusAnalysis(BaseModel):
    unit_coverage_percentage: int
    unit_name: str
    matched_videos_titles: list[str]
    matched_topics: list[str]
    unmatched_topics: list[str]

class AnalysisResponse(BaseModel):
    overall_syllabus_coverage_percentage: int
    sylabus_analysis: list[SyllabusAnalysis]
    
@app.post("/api/v1/agent/generate-topics/")
async def generate_topics(syll: Syllabus):
    try:
        '''
            TODO: Here we'll have to implement passing of syllabus to constructor
                  for further processing using LLM 
        '''
        cookedTopics = CookedCourseAgent(syll).extractTopics()
        return cookedTopics
    except Exception as e:
        print(e)
        raise HTTPException(status_code=500, detail="Something went wrong")

@app.post("/api/v1/agent/analyze-topics/")
async def analyze_topics(payload: YTAndSyllabusTopics):
    try:
        syllabus_topics = payload.syllabus_topics
        # remove id from syllabus topics
        syllabus_topics = [
            {key: value for key, value in unit.items() if key != "id"}
            for unit in syllabus_topics
        ]
        
        channel_topics = payload.channel_topics
        
        llm = init_chat_model(
            "openai/gpt-oss-20b",
            model_provider="groq",
            max_completion_tokens=32768 # gotta keep an eye on this
        )
        
        structured_llm = llm.with_structured_output(AnalysisResponse, method="json_schema")
        
        course_topics_prompt_template = PromptTemplate(
            input_variables=["syllabus_units", "playlist_video_titles"], 
            template=SYLLABUS_ANALYSIS_PROMPT
        )
        
        chain = course_topics_prompt_template | structured_llm
        
        aggregated_llm_res = []
        
        # Iterate over Playlists
        for channel_name, video_titles in list(channel_topics.items())[:MAX_PLAYLISTS_TO_ITERATE]:        
            res = chain.invoke(
                input={
                    "syllabus_units": syllabus_topics, 
                    "playlist_video_titles": video_titles
                })
            
            aggregated_llm_res.append({
                "channelName": channel_name,
                "analyzedPlaylistData": res.model_dump()
            })
            
            time.sleep(3)
        
        return aggregated_llm_res
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        
        # to mainly check max tokens consumed or not
        if isinstance(e.body, dict):
            print("Failed generation:", e.body.get("error", {}).get("failed_generation"))
        raise HTTPException(
            status_code=500,
            detail="An internal server error occurred. Please check the logs."
        )

