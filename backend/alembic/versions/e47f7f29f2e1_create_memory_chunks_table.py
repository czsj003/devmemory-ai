"""create memory chunks table

Revision ID: e47f7f29f2e1
Revises: d10a4f6b2c1e
Create Date: 2026-07-13 00:00:00.000000

"""
from typing import Sequence, Union

import pgvector.sqlalchemy
import sqlalchemy as sa
from alembic import op


revision: str = "e47f7f29f2e1"
down_revision: Union[str, Sequence[str], None] = "d10a4f6b2c1e"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.execute("CREATE EXTENSION IF NOT EXISTS vector")

    op.create_table(
        "memory_chunks",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("project_id", sa.Integer(), nullable=False),
        sa.Column("source_type", sa.String(length=50), nullable=False),
        sa.Column("source_id", sa.Integer(), nullable=False),
        sa.Column("source_title", sa.String(length=255), nullable=False),
        sa.Column("content", sa.Text(), nullable=False),
        sa.Column("chunk_index", sa.Integer(), nullable=False),
        sa.Column("embedding", pgvector.sqlalchemy.Vector(1536), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(timezone=True),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_memory_chunks_id"), "memory_chunks", ["id"], unique=False)
    op.create_index(
        op.f("ix_memory_chunks_project_id"),
        "memory_chunks",
        ["project_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_memory_chunks_source_type"),
        "memory_chunks",
        ["source_type"],
        unique=False,
    )
    op.create_index(
        op.f("ix_memory_chunks_source_id"),
        "memory_chunks",
        ["source_id"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_memory_chunks_source_id"), table_name="memory_chunks")
    op.drop_index(op.f("ix_memory_chunks_source_type"), table_name="memory_chunks")
    op.drop_index(op.f("ix_memory_chunks_project_id"), table_name="memory_chunks")
    op.drop_index(op.f("ix_memory_chunks_id"), table_name="memory_chunks")
    op.drop_table("memory_chunks")
