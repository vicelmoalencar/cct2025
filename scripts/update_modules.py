import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Carregar variáveis de ambiente
load_dotenv()

# Configuração do Supabase
url = os.getenv("VITE_SUPABASE_URL")
key = os.getenv("VITE_SUPABASE_ANON_KEY")

if not url or not key:
    raise ValueError("As variáveis de ambiente VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidas")

supabase: Client = create_client(url, key)

def update_modules():
    """Atualiza os IDs dos cursos na tabela de módulos."""
    try:
        # Verificar os módulos que precisam de atualização
        response = supabase.table('modulos').select('*').execute()
        if hasattr(response, 'error') and response.error:
            print(f"Erro ao buscar módulos: {response.error}")
            return
        
        total_modules = len(response.data)
        print(f"Total de módulos encontrados: {total_modules}")

        # Buscar todos os cursos
        response = supabase.table('cursos').select('*').execute()
        if hasattr(response, 'error') and response.error:
            print(f"Erro ao buscar cursos: {response.error}")
            return
        
        total_courses = len(response.data)
        print(f"Total de cursos encontrados: {total_courses}")

        # Criar um dicionário de cursos para facilitar a busca
        courses_dict = {course['id_bubble_curso']: course['id'] for course in response.data}

        # Atualizar cada módulo
        updated_count = 0
        for module in response.data:
            if module['id_bubble_curso'] in courses_dict:
                course_id = courses_dict[module['id_bubble_curso']]
                response = supabase.table('modulos')\
                    .update({'id_curso': course_id})\
                    .eq('id', module['id'])\
                    .execute()
                
                if hasattr(response, 'error') and response.error:
                    print(f"Erro ao atualizar módulo {module['id']}: {response.error}")
                else:
                    updated_count += 1
            else:
                print(f"Aviso: Curso não encontrado para o módulo {module['id']} (id_bubble_curso: {module['id_bubble_curso']})")

        print(f"\nAtualização concluída!")
        print(f"Total de módulos atualizados: {updated_count}")
        print(f"Módulos não atualizados: {total_modules - updated_count}")

    except Exception as e:
        print(f"Erro inesperado: {e}")

if __name__ == "__main__":
    update_modules()
