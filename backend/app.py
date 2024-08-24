from fastapi import FastAPI, UploadFile, File, HTTPException
from pydantic import BaseModel
from langchain_community.llms import Ollama
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.document_loaders import PyMuPDFLoader
from langchain_community.embeddings import OllamaEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.documents import Document

app = FastAPI()

class Question(BaseModel):
    question: str

class RAGApp:
    def _init_(self):
        # Initialize LLM and other components
        self.llm = Ollama(model="mistral")
        self.embeddings_llm = OllamaEmbeddings(model="mistral")
        self.text_splitter = RecursiveCharacterTextSplitter()
        self.prompt = ChatPromptTemplate.from_template("""
        Answer the following question based on the provided context and your internal knowledge.
        Give priority to context and if you are not sure then say you are not aware of the topic:
        <context>
        {context}
        </context>
        Question: {input}
        """)
        self.document_chain = create_stuff_documents_chain(self.llm, self.prompt)

    def process_pdf(self, pdf_file: UploadFile):
        # Load and process the PDF file dynamically
        loader = PyMuPDFLoader(pdf_file.file)
        docs = loader.load()
        documents = self.text_splitter.split_documents(docs)
        vector_index = FAISS.from_documents(documents, self.embeddings_llm)
        retriever = vector_index.as_retriever()
        return retriever

    def get_answer(self, question: str, retriever) -> str:
        # Retrieve relevant documents and generate an answer
        relevant_docs = retriever.invoke({"input": question})
        context = "\n".join([doc.page_content for doc in relevant_docs])
        response = self.document_chain.invoke({
            "input": question,
            "context": [Document(page_content=context)]
        })
        return response

# Initialize RAGApp instance
rag_app = RAGApp()

@app.post("/ask")
async def ask_question(question: Question, pdf: UploadFile = File(...)):
    try:
        # Process the uploaded PDF and create a retriever
        retriever = rag_app.process_pdf(pdf)
        
        # Get the answer to the question based on the PDF content
        answer = rag_app.get_answer(question.question, retriever)
        
        # Return the question and the generated answer
        return {"question": question.question, "answer": answer}
    
    except Exception as e:
        # Handle exceptions and return an appropriate error message
        raise HTTPException(status_code=500, detail=str(e))