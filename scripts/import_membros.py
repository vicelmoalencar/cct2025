import pandas as pd
from supabase import create_client
import os
from dotenv import load_dotenv
from datetime import datetime
import sys

# Carrega as variáveis de ambiente do arquivo .env
load_dotenv()

# Configuração do cliente Supabase
supabase_url = os.getenv('VITE_SUPABASE_URL')
supabase_key = os.getenv('VITE_SUPABASE_ANON_KEY')
supabase = create_client(supabase_url, supabase_key)

def convert_date(date_str):
    if pd.isna(date_str):
        return None
    try:
        # Tenta converter a data para o formato ISO
        return pd.to_datetime(date_str).isoformat()
    except:
        return None

def import_membros(csv_path):
    try:
        # Lê o arquivo CSV especificando o tipo da coluna id_bubble_membro como string
        df = pd.read_csv(csv_path, sep=';', dtype={'id_bubble_membro': str})
        
        # Converte as datas
        if 'data_expiracao' in df.columns:
            df['data_expiracao'] = df['data_expiracao'].apply(convert_date)
        
        # Garante que id_bubble_membro seja string
        if 'id_bubble_membro' in df.columns:
            df['id_bubble_membro'] = df['id_bubble_membro'].astype(str)
        
        # Converte o DataFrame para lista de dicionários
        membros = df.to_dict('records')
        
        # Contador para acompanhar o progresso
        total = len(membros)
        success = 0
        errors = 0
        
        print(f"Iniciando importação de {total} membros...")
        
        # Insere cada registro na tabela
        for membro in membros:
            try:
                # Remove valores NaN/None
                membro = {k: v for k, v in membro.items() if pd.notna(v)}
                
                # Converte teste_gratis para booleano se existir
                if 'teste_gratis' in membro:
                    membro['teste_gratis'] = bool(membro['teste_gratis'])
                
                # Insere no Supabase
                result = supabase.table('membros').insert(membro).execute()
                success += 1
                print(f"Progresso: {success}/{total} registros processados", end='\r')
                
            except Exception as e:
                errors += 1
                print(f"\nErro ao inserir membro {membro.get('id_bubble_membro', 'unknown')}: {str(e)}")
        
        print(f"\nImportação concluída!")
        print(f"Total processado: {total}")
        print(f"Sucessos: {success}")
        print(f"Erros: {errors}")
        
    except Exception as e:
        print(f"Erro ao processar o arquivo CSV: {str(e)}")

def update_modulos_curso_id():
    try:
        # Buscar todos os módulos
        modulos_response = supabase.table('modulos').select('*').execute()
        modulos = modulos_response.data

        # Buscar todos os cursos
        cursos_response = supabase.table('cursos').select('*').execute()
        cursos = cursos_response.data

        # Criar um dicionário de cursos com id_bubble_curso como chave
        cursos_dict = {curso['id_bubble_curso']: curso['id_curso'] for curso in cursos}

        # Atualizar cada módulo
        for modulo in modulos:
            if modulo['id_bubble_curso'] in cursos_dict:
                curso_id = cursos_dict[modulo['id_bubble_curso']]
                supabase.table('modulos').update({'id_curso': curso_id}).eq('id_bubble_modulo', modulo['id_bubble_modulo']).execute()
                print(f"Módulo {modulo['id_bubble_modulo']} atualizado com curso_id {curso_id}")
            else:
                print(f"Aviso: Curso não encontrado para o módulo {modulo['id_bubble_modulo']} (id_bubble_curso: {modulo['id_bubble_curso']})")

        print("Atualização concluída!")
    except Exception as e:
        print(f"Erro ao atualizar módulos: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print('Uso: python import_membros.py "C:/Users/55849/Downloads/membros.csv"')
        print('Ou execute python import_membros.py update_modulos para atualizar os IDs dos cursos')
    else:
        if sys.argv[1] == "update_modulos":
            update_modulos_curso_id()
        else:
            csv_path = sys.argv[1]
            if not os.path.exists(csv_path):
                print(f"Arquivo não encontrado: {csv_path}")
            else:
                import_membros(csv_path)
