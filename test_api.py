import json
from rag_engine import RAGEngine

def run_tests():
    print("==================================================")
    print(" CampusVoice AI RAG Backend Engine - Test Runner ")
    print("==================================================\n")

    engine = RAGEngine()

    test_queries = [
        ("English Query (CS Dept)", "Where is the Computer Science Department located?"),
        ("Kannada Query (CS Dept)", "ಕಂಪ್ಯೂಟರ್ ಸೈನ್ಸ್ ವಿಭಾಗ ಎಲ್ಲಿದೆ?"),
        ("Hindi Query (Accounts Office)", "अकाउंट्स ऑफिस कहाँ है?"),
        ("Fee Deadline Query", "When is the fee payment deadline without fine?"),
        ("Out-of-Domain Safety Gate", "What is today's lunch menu in cafeteria?")
    ]

    for label, query in test_queries:
        print(f"📌 {label}")
        print(f"   Query: \"{query}\"")
        try:
            response = engine.query(query)
            print("   Response JSON:")
            print(json.dumps(response.model_dump(), indent=4, ensure_ascii=False))
        except Exception as e:
            print(f"   ❌ Error: {e}")
        print("-" * 50)

if __name__ == "__main__":
    run_tests()
